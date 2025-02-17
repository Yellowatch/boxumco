import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Adjust to your backend's base URL
  timeout: 10000,
});

// Request interceptor: Attach access token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken'); // Using a separate key for access token
    if (accessToken) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: On 401, try to refresh the token and retry the request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If error response is 401 and this request hasn't already been retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken'); // Retrieve the refresh token
        if (!refreshToken) {
          // No refresh token available, so reject the error
          return Promise.reject(error);
        }
        // Request a new access token using the refresh token
        const refreshResponse = await axios.post('http://localhost:8000/auth/refresh', { token: refreshToken });
        const { accessToken: newAccessToken } = refreshResponse.data as { accessToken: string };
        // Store the new access token
        localStorage.setItem('accessToken', newAccessToken);
        // Update the Authorization header and retry the original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If the refresh fails, clear tokens and reject
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
