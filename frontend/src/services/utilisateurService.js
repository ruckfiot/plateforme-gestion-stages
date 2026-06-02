import api from './api';
import axios from 'axios';
const API_URL = 'http://localhost:8080/api';

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

const getPromotions = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await axios.get(`${API_URL}/promotions`, {
    headers: {
      'Authorization': `Bearer ${user?.token}`
    }
  });
  return response.data;
};


const utilisateurService = {
  getApprenants, updateApprenant, deleteApprenant,
  getEnseignants, updateEnseignant, deleteEnseignant,
  getPromotions
};

export default utilisateurService;