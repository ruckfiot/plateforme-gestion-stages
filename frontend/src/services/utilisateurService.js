import api from './api';

// --- APPRENANTS (Élèves) ---
const getApprenants = async () => {
  const response = await api.get('/apprenants');
  return response.data;
};

const updateApprenant = async (id, data) => {
  const response = await api.put(`/apprenants/${id}`, data);
  return response.data;
};

const deleteApprenant = async (id) => {
  const response = await api.delete(`/apprenants/${id}`);
  return response.data;
};

// --- ENSEIGNANTS (Profs) ---
const getEnseignants = async () => {
  const response = await api.get('/enseignants');
  return response.data;
};

const updateEnseignant = async (id, data) => {
  const response = await api.put(`/enseignants/${id}`, data);
  return response.data;
};

const deleteEnseignant = async (id) => {
  const response = await api.delete(`/enseignants/${id}`);
  return response.data;
};

const utilisateurService = {
  getApprenants, updateApprenant, deleteApprenant,
  getEnseignants, updateEnseignant, deleteEnseignant
};

export default utilisateurService;