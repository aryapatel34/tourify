const API_BASE_URL = 'https://tourify-fwlr.onrender.com';

/**
 * A custom fetch wrapper that handles JSON parsing, error throwing, and authorization.
 */
export const fetchClient = async (endpoint, { body, ...customConfig } = {}) => {
  // Try to get token from localStorage for now, or context could inject it
  const token = localStorage.getItem('accessToken');
  
  const headers = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    // If body is FormData (for file uploads), let browser set Content-Type
    if (body instanceof FormData) {
      delete config.headers['Content-Type'];
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  let data;
  try {
    data = await response.json();
  } catch (err) {
    // Some responses might not be JSON (e.g. 204 No Content)
    data = null;
  }

  if (response.ok) {
    return data;
  } else {
    // Throw error for React Query to catch
    const errorMessage = data?.message || response.statusText;
    throw new Error(errorMessage);
  }
};
