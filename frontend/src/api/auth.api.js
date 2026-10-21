import api from './axios';

export const registerUser = (data) => api.post('/auth/register', data).then((r) => r.data.user);
export const loginUser = (data) => api.post('/auth/login', data).then((r) => r.data.user);
export const logoutUser = () => api.post('/auth/logout');
export const fetchMe = () => api.get('/auth/me').then((r) => r.data.user);