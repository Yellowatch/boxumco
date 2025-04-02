import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Adjust to your backend's base URL
  timeout: 10000,
});

// Request interceptor: Attach access token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token'); // Using a separate key for access token
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
        const refreshToken = localStorage.getItem('refresh_token'); // Retrieve the refresh token
        if (!refreshToken) {
          // No refresh token available, so reject the error
          return Promise.reject(error);
        }
        // Request a new access token using the refresh token
        const refreshResponse = await axiosInstance.post('/api/users/token/refresh/', { refresh: refreshToken });
        const { access: newAccessToken } = refreshResponse.data as { access: string };
        // Store the new access token
        localStorage.setItem('access_token', newAccessToken);
        // Update the Authorization header and retry the original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If the refresh fails, clear tokens and reject
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
