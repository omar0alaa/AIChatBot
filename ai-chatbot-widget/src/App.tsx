import React from 'react';
import './App.css';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Chatbot Widget Demo</h1>
        <p>Click the chat button in the bottom right corner to start a conversation.</p>
      </header>
      <main>
        <div className="content">
          <h2>Your Website Content Here</h2>
          <p>This is a demo page showing how the AI chatbot widget can be integrated into any website.</p>
          <p>The widget appears as a floating button in the corner and expands into a chat window when clicked.</p>
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}

export default App; 