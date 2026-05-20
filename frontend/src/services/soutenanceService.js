import api from './api'; 

const getAllStages = async () => {
  const response = await api.get('/soutenances');
  return response.data;
};

const createStage = async (stageData) => {
  const response = await api.post('/soutenances', stageData);
  return response.data;
};

const stageService = {
  getAllStages,
  createStage
};

export default stageService;