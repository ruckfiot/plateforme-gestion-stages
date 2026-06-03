import api from './api';

// NAVIGATION ACADÉMIQUE : Instance interceptée 'api' récupérant la liste globale des soutenances planifiées
const getAllSoutenances = async () => {
  const response = await api.get('/soutenances');
  return response.data;
};

// PLANIFICATION JURY : Requête POST transmettant le DTO de soutenance (Date, Salle, liaison Stage et Enseignant)
const programmerSoutenance = async (soutenanceData) => {
  const response = await api.post('/soutenances', soutenanceData);
  return response.data;
};

// NOTE ORALE PERSISTANTE : Envoie la note et le commentaire de présentation au point de contrôle de l'API Spring Boot
const evaluerSoutenance = async (id, evaluation) => {
  const response = await api.post(`/soutenances/${id}/evaluer`, evaluation);
  return response.data;
};

const soutenanceService = {
  getAllSoutenances,
  programmerSoutenance,
   evaluerSoutenance,
};

export default soutenanceService;