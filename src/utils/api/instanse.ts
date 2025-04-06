import axios from 'axios';
import { toast } from 'sonner';

import { API_URL } from '@/utils/constants';

export const api = axios.create({
    baseURL: `${API_URL}`,
    headers: { 'X-Custom-Header': 'foobar'},
});

api.interceptors.response.use(
    (response) => {
      console.log(response);
      return response;
    },
    (error) => {
      if (error.response.status === 500) {
        toast.error(`Ошибка сервера:${error.response.data.message}`);
      }
      if (error.response.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  );
  
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/Auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
  }
);