const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function generateStudySet(topic, signal) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic }),
      signal
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to generate study set');
    }

    return result.data;
  } catch (err) {
    if (err.name === 'AbortError') {
      const abortErr = new Error('Request was cancelled');
      abortErr.isAborted = true;
      throw abortErr;
    }
    
    if (err.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the backend server. Please make sure the backend server is running.');
    }

    throw err;
  }
}
