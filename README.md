# AI Chatbot with LM Studio Integration

A web-based chatbot widget that connects to LM Studio's local AI models. This project provides a simple way to add an AI chat interface to any website while keeping your AI models running locally.

## Project Structure

This repository consists of two main parts:

1. **Frontend Widget (`/ai-chatbot-widget`)**: A React application that provides the chat interface
2. **Backend Proxy (`/server`)**: A Node.js Express server that handles communication with LM Studio

## Quick Start

1. **Prerequisites**:
   - LM Studio installed and running with a model loaded
   - Node.js and npm installed

2. **Start the proxy server**:
   ```bash
   cd server
   npm install
   node index.js
   ```

3. **Start the frontend**:
   ```bash
   cd ai-chatbot-widget
   npm install
   npm start
   ```

4. Open your browser to http://localhost:3000

## Key Features

- Connect to any model available in LM Studio
- Configure model parameters like temperature and token limit
- Responsive design works on desktop and mobile
- Proxy server eliminates CORS issues
- Material UI components for a modern look and feel

## Screenshots

_[Screenshots will be added here]_

## Detailed Documentation

For more detailed information, see the README files in each subdirectory:

- [Frontend Widget Documentation](./ai-chatbot-widget/README.md)
- [Backend Proxy Documentation](./server/README.md)

## License

MIT 