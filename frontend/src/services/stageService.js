import api from './api';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/stages';

const getAllStages = async () => {
  const response = await api.get('/stages');
  return response.data;
};

const createStage = async (stageData, idApprenant, idTuteur, idEntreprise) => {
  const response = await api.post('/stages', stageData, {
    params: { idApprenant, idTuteur, idEntreprise }
  });
  return response.data;
};

const updateStage = async (id, stageData, idApprenant, idTuteur, idEntreprise) => {
  const response = await api.put(`/stages/${id}`, stageData, {
    params: { idApprenant, idTuteur, idEntreprise }
  });
  return response.data;
};

const deleteStage = async (id) => {
  const response = await api.delete(`/stages/${id}`);
  return response.data;
};

const getStagesByTuteur = async () => {
  // 1. On récupère le profil stocké lors de la connexion
  const user = JSON.parse(localStorage.getItem('user'));
  
  // 2. On utilise 'api' (qui connaît déjà l'URL de base) et on ajoute le token
  const response = await api.get('/stages/tuteur', {
    headers: {
      'Authorization': `Bearer ${user?.token}`
    }
  });
  return response.data;
};

const getStagesByApprenant = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Appelle la route /api/stages/apprenant définie dans ton StageController
  const response = await api.get('/stages/apprenant', {
    headers: {
      'Authorization': `Bearer ${user?.token}`
    }
  });
  return response.data;
};

// UPLOAD AVEC FORMDATA
const deposerRapport = async (idStage, fichierPhysical) => {
    const formData = new FormData();
    formData.append('file', fichierPhysical); 

    const user = JSON.parse(localStorage.getItem('user'));

    // Axios génére la bonne frontière
    return await axios.post(`${API_URL}/${idStage}/rapport`, formData, {
        headers: {
            'Authorization': `Bearer ${user?.token}`
        }
    });
};

// DOWNLOAD AVEC BLOB (Pour ouvrir le PDF)
const lireRapport = async (nomFichier) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await axios.get(`${API_URL}/rapports/${nomFichier}`, {
        responseType: 'blob', // CRUCIAL : On dit à React que ce n'est pas du texte, mais un fichier binaire
        headers: {
            'Authorization': `Bearer ${user?.token}` // Ajout de la sécurité
        }
    });
    return response.data;
};

const supprimerRapport = async (idStage) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await axios.delete(`${API_URL}/${idStage}/rapport`, {
        headers: {
            'Authorization': `Bearer ${user?.token}`
        }
    });
    return response.data;
};

const evaluerStage = async (idStage, evaluationData) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const response = await api.post(`/stages/${idStage}/evaluer`, evaluationData, {
    headers: {
      'Authorization': `Bearer ${user?.token}`
    }
  });
  return response.data;
};

const stageService = {
  getAllStages,
  createStage,
  updateStage,
  deleteStage,
  getStagesByTuteur,
  getStagesByApprenant,
  deposerRapport,
  lireRapport,
  evaluerStage,
  supprimerRapport
};

export default stageService;