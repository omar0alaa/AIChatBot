# AI Chatbot Widget (Frontend)

A React-based chat widget component that provides an interactive AI chatbot interface for websites.

## Features

- 💬 Floating chat button that expands into a chat window
- 🤖 Interactive chat interface with typing indicators
- ⚙️ Settings panel for configuring the AI model
- 📱 Fully responsive design works on all devices
- 🎨 Material UI components for modern styling

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [LM Studio](https://lmstudio.ai/) installed and running locally (if you want to use the AI features)
- Proxy server running (see main project README)

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Start the development server
npm start
```

The application will be available at http://localhost:3000

## Component Structure

- `ChatWidget`: The main component that handles the chat interface
- `ChatSettings`: A component for configuring AI model parameters
- `chatService`: Service for handling API communication with the LM Studio API

## Configuration

The widget can be configured through the settings panel accessible via the gear icon:

- **Model Name**: The name of the model loaded in LM Studio
- **Temperature**: Controls randomness (0.0 to 1.0)
- **Max Tokens**: Maximum number of tokens in the response
- **System Prompt**: Instructions for the AI assistant

## Usage as a Component

You can use this widget in your React application by importing it:

```jsx
import ChatWidget from './path/to/components/ChatWidget';

function App() {
  return (
    <div>
      {/* Your app content */}
      <ChatWidget />
    </div>
  );
}
```

## Customization

You can customize the widget appearance by modifying:

- `src/components/ChatWidget.css` - For styling the chat interface
- `src/components/ChatWidget.tsx` - For modifying the component structure
- `src/services/chatService.ts` - For changing how the widget communicates with AI models

## Building for Production

```bash
# Create a production build
npm run build
```

This will create a `build` directory with optimized files ready for deployment.

## License

MIT
