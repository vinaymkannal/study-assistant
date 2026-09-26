export function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let userMessage = err.message || 'An unexpected server error occurred. Please try again.';

  if (err.message === 'EMPTY_RESPONSE') {
    statusCode = 502;
    userMessage = 'The AI model returned an empty response. Please retry.';
  } else if (err.message === 'MALFORMED_JSON') {
    statusCode = 502;
    userMessage = 'The AI model returned invalid JSON data. Please retry.';
  } else if (err.message && (err.message.startsWith('Missing or invalid') || err.message.includes('must be a non-empty array') || err.message.includes('answer does not match'))) {
    statusCode = 422;
    userMessage = `AI output structure validation failed: ${err.message}`;
  } else if (err.message && err.message.includes('Unable to connect to Ollama server')) {
    statusCode = 503;
    userMessage = err.message;
  } else if (err.status) {
    statusCode = err.status;
  }

  res.status(statusCode).json({
    success: false,
    error: userMessage
  });
}
