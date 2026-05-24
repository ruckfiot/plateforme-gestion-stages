import api from './api';

const getAllStages = async () => {
  const response = await api.get('/stages');
  return response.data;
};

const createStage = async (stageData) => {
  const response = await api.post('/stages', stageData);
  return response.data;
};

const updateStage = async (id, stageData) => {
  const response = await api.put(`/stages/${id}`, stageData);
  return response.data;
};

const deleteStage = async (id) => {
  const response = await api.delete(`/stages/${id}`);
  return response.data;
};

const stageService = { getAllStages, createStage, updateStage, deleteStage };
export default stageService;