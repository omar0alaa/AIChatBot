# AI Chatbot Widget with LM Studio Integration

A customizable chat widget for websites that allows visitors to interact with an AI assistant powered by LM Studio.

## Features

- 💬 Floating chat button that expands into a chat window
- 🤖 Integration with LM Studio API for real AI responses
- 🖥️ Proxy server to bypass CORS issues
- ⚙️ Configurable model parameters (temperature, max tokens, etc.)
- 📝 Conversation history maintenance
- 📱 Fully responsive design
- 🎨 Material UI components for modern styling

## Architecture

This project consists of two main components:

1. **React Frontend**: A chat widget built with React, TypeScript, and Material UI
2. **Express Proxy Server**: A Node.js server that proxies requests to LM Studio API to avoid CORS issues

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [LM Studio](https://lmstudio.ai/) installed and running locally with a model loaded
- Web browser (Chrome recommended)

## Getting Started

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/ai-chatbot-lm-studio.git
cd ai-chatbot-lm-studio
```

2. Install frontend dependencies:
```bash
cd ai-chatbot-widget
npm install
```

3. Install server dependencies:
```bash
cd ../server
npm install
```

### Running the Application

1. Start LM Studio and load a model (e.g., gemma-2-2b-it)

2. Start the proxy server:
```bash
cd server
node index.js
```

3. Start the React development server:
```bash
cd ai-chatbot-widget
npm start
```

4. Open your browser to http://localhost:3000

## How to Use

1. Click on the chat bubble icon in the bottom right corner to open the chat window
2. Type your message and press Enter or click the Send button
3. The message will be sent to LM Studio via the proxy server
4. The AI's response will appear in the chat window

## Configuration

You can configure the LM Studio settings by clicking the gear icon in the chat header:

- **Model Name**: The name of the model loaded in LM Studio
- **Temperature**: Controls randomness (0.0 to 1.0)
- **Max Tokens**: Maximum number of tokens in the response
- **System Prompt**: Instructions for the AI assistant

## Integration Into Your Website

### Option 1: Using as a React Component

1. Build the project:
```bash
cd ai-chatbot-widget
npm run build
```

2. Copy the built files from the `build` directory to your project.

3. Import the ChatWidget component:
```jsx
import ChatWidget from './path/to/components/ChatWidget';

function YourApp() {
  return (
    <div>
      {/* Your website content */}
      <ChatWidget />
    </div>
  );
}
```

### Option 2: Deploy as a Standalone Service

1. Configure the proxy server for your production environment
2. Build the React app
3. Serve both the proxy server and the built React app from your server

## Customization

You can customize the widget by modifying:

- `src/components/ChatWidget.css` for styling changes
- `src/components/ChatWidget.tsx` for UI modifications
- `src/services/chatService.ts` for API communication changes

## Troubleshooting

- **CORS Issues**: Make sure the proxy server is running
- **Connection Errors**: Verify that LM Studio is running and has a model loaded
- **Response Errors**: Check the console for detailed error messages

## License

MIT
