// Replace with your actual local IP from ipconfig
const BASE_URL = 'http://192.168.1.7:3001';

export const API = {
  status: `${BASE_URL}/status`,
  start: `${BASE_URL}/start`,
  stop: `${BASE_URL}/stop`,
  connect: `${BASE_URL}/connect`,
  logs: `${BASE_URL}/logs`,
};

export default BASE_URL;