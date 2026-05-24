import api from './api';

const getAllEntreprises = async () => {
  const response = await api.get('/entreprises');
  return response.data;
};

const createEntreprise = async (entrepriseData) => {
  const response = await api.post('/entreprises', entrepriseData);
  return response.data;
};

const deleteEntreprise = async (id) => {
  const response = await api.delete(`/entreprises/${id}`);
  return response.data;
};

const updateEntreprise = async (id, entrepriseData) => {
  const response = await api.put(`/entreprises/${id}`, entrepriseData);
  return response.data;
};

const entrepriseService = {
  getAllEntreprises,
  createEntreprise,
  updateEntreprise,
  deleteEntreprise,
};

export default entrepriseService;