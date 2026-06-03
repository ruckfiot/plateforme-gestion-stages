import api from './api';
import axios from 'axios';
const API_URL = 'http://localhost:8080/api';

// --- APPRENANTS (Élèves) ---
const getApprenants = async () => {
  const response = await api.get('/apprenants');
  return response.data;
};

const updateApprenant = async (id, data, idPromotion) => {
  const config = {};

  // On s'assure d'envoyer l'idPromotion dans les paramètres de l'URL (?idPromotion=X)
  // Si on reçoit undefined, on ne fait rien.
  if (idPromotion !== undefined) {
    // Si l'idPromotion est vide (l'admin a remis "Sélectionner une promo..."), 
    // on force la valeur à null pour bien vider la case en base de données.
    config.params = { idPromotion: idPromotion || null };
  }

  // On passe config en 3ème argument de api.put
  const response = await api.put(`/apprenants/${id}`, data, config);
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

// --- PROMOTIONS ---
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
  getApprenants, 
  updateApprenant, 
  deleteApprenant,
  getEnseignants, 
  updateEnseignant, 
  deleteEnseignant,
  getPromotions
};

export default utilisateurService;