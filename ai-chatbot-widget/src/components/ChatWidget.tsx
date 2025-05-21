import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, Button, Typography, IconButton, Fab, Tooltip, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { 
  sendMessageWithHistory, 
  ChatMessage, 
  ApiMessage,
  LM_STUDIO_CONFIG,
  testApiConnection
} from '../services/chatService';
import ChatSettings from './ChatSettings';
import './ChatWidget.css';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  
  // Messages for the API in the format LM Studio expects
  const [apiMessages, setApiMessages] = useState<ApiMessage[]>([
    {
      role: 'system',
      content: LM_STUDIO_CONFIG.systemPrompt
    },
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?'
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isProxyAvailable, setIsProxyAvailable] = useState(false);
  const [settings, setSettings] = useState({...LM_STUDIO_CONFIG});
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if proxy server and LM Studio are available on load
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        // Test the API connection
        console.log('Testing API connection via proxy server...');
        const isConnected = await testApiConnection();
        
        if (isConnected) {
          console.log('Connected to LM Studio via proxy server successfully');
          setApiError(null);
          setIsProxyAvailable(true);
        } else {
          setApiError('Cannot connect to LM Studio. Make sure LM Studio is running and a model is loaded.');
          setIsProxyAvailable(false);
        }
      } catch (error) {
        console.error('Error checking proxy server connection:', error);
        setApiError('Cannot connect to proxy server. Make sure the server is running on port 5000.');
        setIsProxyAvailable(false);
      }
    };
    
    checkApiConnection();
  }, [settings.modelName]);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    // Add user message to UI
    const userMessage: ChatMessage = {
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Add user message to API messages
    const newApiMessages: ApiMessage[] = [
      ...apiMessages,
      {
        role: 'user' as const,
        content: message
      }
    ];
    
    // Store message locally before clearing input
    const currentMessage = message;
    setMessage('');
    setIsTyping(true);
    setApiError(null);

    try {
      console.log('Sending message to proxy server:', currentMessage);
      
      // Log the messages we're sending for debugging
      console.log('All messages being sent:', JSON.stringify(newApiMessages));
      
      // Update state here before the API call
      setApiMessages(newApiMessages);
      
      // Call the API with the properly formed messages
      const botResponse = await sendMessageWithHistory(newApiMessages, settings);
      
      // Add assistant response to API messages
      setApiMessages(prev => [
        ...prev,
        {
          role: 'assistant' as const,
          content: botResponse.text
        }
      ]);
      
      // Add to UI messages
      setMessages(prev => [...prev, botResponse]);
    } catch (error: any) {
      console.error('Error getting response:', error);
      
      // Show error message in chat
      setMessages(prev => [...prev, {
        text: `Error: ${error.message || 'Failed to get response from AI'}`,
        sender: 'bot',
        timestamp: new Date(),
      }]);
      
      // Set error state with more details
      setApiError(`Failed to get AI response: ${error.message}`);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleSaveSettings = (newSettings: typeof LM_STUDIO_CONFIG) => {
    setSettings(newSettings);
    
    // Update the system prompt in the conversation
    setApiMessages(prev => {
      const updated = [...prev];
      // Find and update the system message
      const systemIndex = updated.findIndex(msg => msg.role === 'system');
      if (systemIndex >= 0) {
        updated[systemIndex] = {
          role: 'system' as const,
          content: newSettings.systemPrompt
        };
      } else {
        // Add system message if not found
        updated.unshift({
          role: 'system' as const,
          content: newSettings.systemPrompt
        });
      }
      return updated;
    });
    
    // Test the API connection with new settings
    testApiConnection().then(isConnected => {
      if (isConnected) {
        setApiError(null);
        setIsProxyAvailable(true);
      } else {
        setApiError('Could not connect to LM Studio with these settings');
        setIsProxyAvailable(false);
      }
    });
  };

  return (
    <div className="chat-widget-container">
      {!isOpen ? (
        <Fab 
          color="primary" 
          className="chat-toggle-button"
          onClick={toggleChat}
          aria-label="chat"
        >
          <ChatIcon />
        </Fab>
      ) : (
        <Paper elevation={3} className="chat-window">
          <Box className="chat-header">
            <Typography variant="h6">AI Assistant</Typography>
            <Tooltip title="Model currently in use">
              <Typography variant="caption" className="model-indicator">
                {settings.modelName}
              </Typography>
            </Tooltip>
            {!isProxyAvailable && (
              <Typography variant="caption" className="offline-indicator">
                (Proxy Offline)
              </Typography>
            )}
            <Tooltip title="Settings">
              <IconButton onClick={() => setShowSettings(true)} size="small" color="inherit">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton onClick={toggleChat} size="small" color="inherit">
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {apiError && (
            <Alert severity="error" sx={{ margin: 1 }}>
              {apiError}
            </Alert>
          )}
          
          <Box className="messages-container">
            {messages.map((msg, index) => (
              <Box 
                key={index} 
                className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <Typography variant="body1">{msg.text}</Typography>
                <Typography variant="caption" className="timestamp">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            ))}
            {isTyping && (
              <Box className="message bot-message">
                <Typography variant="body2">AI is typing...</Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
          
          <Box className="chat-input">
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              value={message}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
              size="small"
              disabled={!isProxyAvailable}
            />
            <Button 
              variant="contained" 
              color="primary" 
              endIcon={<SendIcon />}
              onClick={sendMessage}
              disabled={message.trim() === '' || !isProxyAvailable}
            >
              Send
            </Button>
          </Box>
        </Paper>
      )}
      
      <ChatSettings 
        open={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        currentConfig={settings}
      />
    </div>
  );
};

export default ChatWidget; 