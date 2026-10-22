import api from './axios';

export const getTasks = (params) => api
    .get('/tasks', { params })
    .then((r) => r.data);
export const getReminders = () => api
    .get('/tasks/reminders')
    .then((r) => r.data);
export const createTask = (data) => api
    .post('/tasks', data)
    .then((r) => r.data.task);
export const updateTask = (id, data) => api
    .patch(`/tasks/${id}`, data)
    .then((r) => r.data.task);
export const deleteTask = (id) => api
    .delete(`/tasks/${id}`);