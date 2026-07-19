import api from './axios';

export const getProjects = () => api.get('/projects').then(r => r.data);
export const getProject = (id) => api.get(`/projects/${id}`).then(r => r.data);
export const createProject = (data) => api.post('/projects', data).then(r => r.data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`).then(r => r.data);

export const getServices = () => api.get('/calculator/services').then(r => r.data);
export const getAllServices = () => api.get('/calculator/services/all').then(r => r.data);
export const getProjectTypes = () => api.get('/calculator/project-types').then(r => r.data);
export const addProjectType = (name) => api.post('/calculator/project-types', { name }).then(r => r.data);
export const deleteProjectType = (id) => api.delete(`/calculator/project-types/${id}`).then(r => r.data);
export const calculate = (data) => api.post('/calculator/calculate', data).then(r => r.data);
export const createService = (data) => api.post('/calculator', data).then(r => r.data);
export const updateService = (id, data) => api.put(`/calculator/${id}`, data).then(r => r.data);
export const deleteService = (id) => api.delete(`/calculator/${id}`).then(r => r.data);

export const getLanding = () => api.get('/landing').then(r => r.data);
export const updateLanding = (data) => api.put('/landing', data).then(r => r.data);

export const getAbout = () => api.get('/about').then(r => r.data);
export const updateAbout = (data) => api.put('/about', data).then(r => r.data);
export const addTeamMember = (data) => api.post('/about/team', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const updateTeamMember = (index, data) => api.patch(`/about/team/${index}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const deleteTeamMember = (index) => api.delete(`/about/team/${index}`).then(r => r.data);

export const submitContact = (data) => api.post('/contact', data).then(r => r.data);
export const getMessages = () => api.get('/contact').then(r => r.data);
export const deleteMessage = (id) => api.delete(`/contact/${id}`).then(r => r.data);
export const markRead = (id) => api.patch(`/contact/${id}/read`).then(r => r.data);

export const getUsers = () => api.get('/users').then(r => r.data);
export const deleteUser = (id) => api.delete(`/users/${id}`).then(r => r.data);
export const blockUser = (id) => api.patch(`/users/${id}/block`).then(r => r.data);

export const getSettings = () => api.get('/settings').then(r => r.data);
export const updateSettings = (data) => api.put('/settings', data).then(r => r.data);

export const adminLogin = (data) => api.post('/auth/admin-login', data).then(r => r.data);
export const getProfile = () => api.get('/auth/profile').then(r => r.data);
