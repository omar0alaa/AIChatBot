const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// LM Studio API endpoint
const LM_STUDIO_API = 'http://127.0.0.1:1234/v1';

// Enable CORS for the React app
app.use(cors());
app.use(express.json());

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Proxy server for LM Studio API is running');
});

// Handle model list request
app.get('/models', async (req, res) => {
  try {
    console.log('Fetching models from LM Studio...');
    const response = await axios.get(`${LM_STUDIO_API}/models`);
    console.log('Models fetched successfully');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching models:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch models from LM Studio',
      details: error.message
    });
  }
});

// Handle chat completions request
app.post('/chat', async (req, res) => {
  try {
    console.log('Request body:', JSON.stringify(req.body));
    
    const { model, messages, temperature, max_tokens } = req.body;
    
    if (!model || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Invalid request body. Required: model and messages array.' 
      });
    }
    
    console.log(`Sending chat request to LM Studio with model: ${model}`);
    
    const response = await axios.post(`${LM_STUDIO_API}/chat/completions`, {
      model,
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 500
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Chat response received from LM Studio');
    res.json(response.data);
  } catch (error) {
    console.error('Error in chat completion:', error.message);
    
    // Provide detailed error information
    const errorResponse = {
      error: 'Failed to get chat completion from LM Studio',
      details: error.message
    };
    
    // If axios error contains response from LM Studio, include it
    if (error.response) {
      errorResponse.status = error.response.status;
      errorResponse.data = error.response.data;
    }
    
    res.status(500).json(errorResponse);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Proxying requests to LM Studio at ${LM_STUDIO_API}`);
}); 