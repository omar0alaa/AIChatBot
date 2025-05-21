// Chat service that connects to LM Studio API via our proxy server

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Using our proxy server to avoid CORS issues
const PROXY_URL = 'http://localhost:5000';

// You can change this to match the specific model you're running in LM Studio
export const LM_STUDIO_CONFIG = {
  modelName: 'gemma-2-2b-it', // Change this to your actual model name in LM Studio
  temperature: 0.7,
  max_tokens: 500,
  systemPrompt: 'You are a helpful, friendly assistant on a website. Keep your responses concise and helpful.'
};

// This is the exact format expected by the API
export interface ApiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Function to get default response if API call fails
const getDefaultResponse = (error: any): string => {
  console.error('AI Chatbot API connection error:', error);
  
  if (error.message && error.message.includes('Failed to fetch')) {
    return `Could not connect to the proxy server. Please make sure the server is running on port 5000.

Error details: ${error.message}`;
  }
  
  return `Sorry, I couldn't connect to the AI service. Error: ${error.message || 'Unknown error'}`;
};

// Helper function to test the API connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing proxy server connection...');
    
    // First try to get the models list through our proxy
    const modelResponse = await fetch(`${PROXY_URL}/models`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!modelResponse.ok) {
      console.error(`Model list API error: ${modelResponse.status}`);
      const text = await modelResponse.text();
      console.error('Response:', text);
      return false;
    }
    
    const modelData = await modelResponse.json();
    console.log('Available models:', modelData);
    return true;
  } catch (error) {
    console.error('API test error:', error);
    return false;
  }
};

// Implementation for sending messages to LM Studio API via our proxy
export const sendMessageWithHistory = async (
  messages: ApiMessage[],
  config = LM_STUDIO_CONFIG
): Promise<ChatMessage> => {
  try {
    // Basic validation
    if (!messages || messages.length === 0) {
      throw new Error('No messages provided');
    }
    
    // Log the URL and request payload
    console.log('Sending request to proxy server');
    
    const payload = {
      model: config.modelName,
      messages: messages,
      temperature: config.temperature,
      max_tokens: config.max_tokens
    };
    
    console.log('Request payload:', JSON.stringify(payload));
    
    // Make the API call through our proxy server
    const response = await fetch(`${PROXY_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('Response status:', response.status);
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('Error response from proxy server:', responseText);
      throw new Error(`API error (${response.status}): ${responseText}`);
    }
    
    // Parse the response
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (e) {
      console.error('Failed to parse JSON response:', e);
      throw new Error('Invalid JSON response from server');
    }
    
    // Validate the response structure
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from API');
    }
    
    // Return the bot's response
    return {
      text: data.choices[0].message.content.trim(),
      sender: 'bot',
      timestamp: new Date()
    };
  } catch (error: any) {
    console.error('Error in API call:', error);
    return {
      text: getDefaultResponse(error),
      sender: 'bot',
      timestamp: new Date()
    };
  }
};

// Simple function for sending a single message
export const sendMessage = async (
  message: string,
  config = LM_STUDIO_CONFIG
): Promise<ChatMessage> => {
  // Create a simple array of messages with just system and user messages
  const messages: ApiMessage[] = [
    {
      role: 'system',
      content: config.systemPrompt
    },
    {
      role: 'user',
      content: message
    }
  ];
  
  // Use the same function to send the request
  return sendMessageWithHistory(messages, config);
};

// If needed in testing when the proxy server is not available
export const getSimulatedResponse = (message: string): Promise<ChatMessage> => {
  console.warn('Using simulated response because proxy server was unavailable');
  return Promise.resolve({
    text: 'Proxy server is not available. Please make sure it\'s running on http://localhost:5000.',
    sender: 'bot',
    timestamp: new Date(),
  });
}; 