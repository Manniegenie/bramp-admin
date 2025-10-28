import axios from 'axios';

const instance = axios.create();

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 403 &&
      error.response.data?.error === 'Forbidden: Invalid admin token.'
    ) {
        // Clear localStorage and redirect to login (no Redux import)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
