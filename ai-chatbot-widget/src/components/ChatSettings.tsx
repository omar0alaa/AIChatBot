import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  Slider,
  Typography,
  Box
} from '@mui/material';
import { LM_STUDIO_CONFIG } from '../services/chatService';

interface ChatSettingsProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: typeof LM_STUDIO_CONFIG) => void;
  currentConfig: typeof LM_STUDIO_CONFIG;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({ 
  open, 
  onClose,
  onSave,
  currentConfig
}) => {
  const [config, setConfig] = useState<typeof LM_STUDIO_CONFIG>({...currentConfig});

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const handleChange = (field: keyof typeof LM_STUDIO_CONFIG, value: any) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>AI Chatbot Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Model Name"
            variant="outlined"
            value={config.modelName}
            onChange={(e) => handleChange('modelName', e.target.value)}
            helperText="Enter the name of the model you're running in LM Studio"
            margin="normal"
          />

          <Typography gutterBottom sx={{ mt: 2 }}>
            Temperature: {config.temperature}
          </Typography>
          <Slider
            value={config.temperature}
            min={0}
            max={1}
            step={0.1}
            onChange={(_, value) => handleChange('temperature', value)}
            valueLabelDisplay="auto"
            aria-labelledby="temperature-slider"
          />
          <Typography variant="caption" color="text.secondary">
            Lower values (0-0.3) make responses more focused and deterministic. 
            Higher values (0.7-1.0) make output more random and creative.
          </Typography>

          <TextField
            fullWidth
            label="Max Tokens"
            type="number"
            variant="outlined"
            value={config.max_tokens}
            onChange={(e) => handleChange('max_tokens', parseInt(e.target.value))}
            helperText="Maximum number of tokens to generate in the response"
            margin="normal"
            inputProps={{ min: 50, max: 2000 }}
          />

          <TextField
            fullWidth
            label="System Prompt"
            variant="outlined"
            value={config.systemPrompt}
            onChange={(e) => handleChange('systemPrompt', e.target.value)}
            helperText="Instructions to the AI about how it should behave"
            margin="normal"
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save Settings</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatSettings; 