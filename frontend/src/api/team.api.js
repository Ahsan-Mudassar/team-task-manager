import api from './axios';

const pick = (key) => (res) => res.data[key];

export const getTeams = () => api
    .get('/teams')
    .then(pick('teams'));
export const getTeam = (id) => api
    .get(`/teams/${id}`)
    .then(pick('team'));
export const createTeam = (data) => api
    .post('/teams', data)
    .then(pick('team'));
export const updateTeam = (id, data) => api
    .patch(`/teams/${id}`, data)
    .then(pick('team'));
export const deleteTeam = (id) => api
    .delete(`/teams/${id}`);
export const addMember = (id, data) => api
    .post(`/teams/${id}/members`, data)
    .then(pick('member'));
export const removeMember = (teamId, userId) => api
    .delete(`/teams/${teamId}/members/${userId}`);