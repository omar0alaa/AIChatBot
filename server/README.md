# AI Chatbot Proxy Server

A Node.js Express server that acts as a proxy between the frontend chat widget and LM Studio API.

## Purpose

This proxy server solves several problems:

1. **CORS Issues**: Eliminates Cross-Origin Resource Sharing (CORS) issues that occur when trying to access LM Studio API directly from the browser
2. **Error Handling**: Provides better error handling and logging for debugging
3. **Request Formatting**: Ensures requests are properly formatted for LM Studio API

## API Endpoints

The server exposes the following endpoints:

- **GET /** - A simple test endpoint that returns a message confirming the server is running
- **GET /models** - Fetches the list of available models from LM Studio
- **POST /chat** - Sends a chat request to LM Studio and returns the response

### Chat Endpoint Details

The `/chat` endpoint accepts POST requests with the following JSON structure:

```json
{
  "model": "gemma-2-2b-it",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant"},
    {"role": "user", "content": "Hello!"}
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

## Configuration

The server connects to LM Studio API at `http://127.0.0.1:1234/v1` by default. If your LM Studio is running on a different port, you can change the `LM_STUDIO_API` constant in `index.js`.

## Running the Server

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node index.js
```

The server will start on port 5000 by default.

## Error Handling

The server provides detailed error messages and logging, which can help diagnose issues with:

- LM Studio connectivity
- Invalid request formatting
- Problems with the LM Studio API responses

## License

MIT 