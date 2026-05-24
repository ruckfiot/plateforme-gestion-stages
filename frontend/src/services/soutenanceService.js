import api from './api';

const getAllSoutenances = async () => {
  const response = await api.get('/soutenances');
  return response.data;
};

const programmerSoutenance = async (soutenanceData) => {
  const response = await api.post('/soutenances', soutenanceData);
  return response.data;
};

const soutenanceService = {
  getAllSoutenances,
  programmerSoutenance,
};

export default soutenanceService;