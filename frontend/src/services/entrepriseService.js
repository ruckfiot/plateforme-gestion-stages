import api from './api'; 

const getAllStages = async () => {
  const response = await api.get('/entreprises');
  return response.data;
};

const createStage = async (stageData) => {
  const response = await api.post('/entreprises', stageData);
  return response.data;
};

const stageService = {
  getAllStages,
  createStage
};

export default stageService;