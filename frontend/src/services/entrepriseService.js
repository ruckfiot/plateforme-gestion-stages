import api from './api';

// INSTANCE AXIOS INTERCEPTÉE : Toutes les requêtes utilisent 'api' qui injecte automatiquement le token JWT dans les headers
const getAllEntreprises = async () => {
  const response = await api.get('/entreprises');
  return response.data;
};

// REQUÊTE POST PARTENAIRES : Transmet l'objet JSON contenant la raison sociale, l'adresse et le contact de la nouvelle entreprise
const createEntreprise = async (entrepriseData) => {
  const response = await api.post('/entreprises', entrepriseData);
  return response.data;
};

// SÉCURITÉ INTÉGRITÉ BDD : L'API Spring Boot lèvera une exception 400/500 si l'ID ciblé est lié à un stage existant (Contrainte FK)
const deleteEntreprise = async (id) => {
  const response = await api.delete(`/entreprises/${id}`);
  return response.data;
};

// MISE À JOUR ID : Point d'entrée PUT permettant de modifier les caractéristiques de l'entreprise par son identifiant unique
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