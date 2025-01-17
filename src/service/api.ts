import { ACCESS_TOKEN, BE_URL, REFRESH_TOKEN } from '@/constant';
import axios from 'axios';
import { getData, saveData } from '@/utils/localStorage';

export function getCookie(name = ACCESS_TOKEN) {
  if (typeof window !== 'undefined') {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }
}

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: getData(ACCESS_TOKEN)
    ? `Bearer ${getData(ACCESS_TOKEN)}`
    : undefined,
};

const AxiosInstance = axios.create({
  baseURL: BE_URL,
  timeout: 300000,
  headers: HEADERS,
});

export const setToken = (token?: string) => {
  if (token) {
    HEADERS['Authorization'] = `Bearer ${token}`;
    AxiosInstance.interceptors.request.use((config) => {
      config.headers['Content-Type'] = HEADERS['Content-Type'];
      config.headers.Authorization = HEADERS.Authorization;
      return config;
    });
  }
  if (!token) {
    HEADERS['Authorization'] = undefined;
    AxiosInstance.interceptors.request.use((config) => {
      config.headers['Content-Type'] = HEADERS['Content-Type'];
      config.headers.Authorization = HEADERS.Authorization;
      return config;
    });
  }
};

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;
    if (response) {
      return Promise.reject(response.data);
    } else return Promise.reject(error);
  }
);

export default AxiosInstance;
