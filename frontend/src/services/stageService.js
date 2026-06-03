import api from './api';
import axios from 'axios';

// API_URL GLOBALE : Utilisée spécifiquement pour les requêtes de fichiers binaires bruts contournant l'instance interceptée
const API_URL = 'http://localhost:8080/api/stages';

const getAllStages = async () => {
  const response = await api.get('/stages');
  return response.data;
};

// PARAMÈTRES REQUÊTE : Associe la structure métier aux identifiants via des query params exigés par le contrôleur Java
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

// INJECTION REQUÊTE : Extrait manuellement le Bearer token du stockage pour isoler les stages rattachés à ce tuteur
const getStagesByTuteur = async () => {
  // On récupère le profil stocké lors de la connexion
  const user = JSON.parse(localStorage.getItem('user'));
  
  // On utilise 'api' (qui connaît déjà l'URL de base) et on ajoute le token
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
// MULTIPART FORMDATA : Encapsule l'objet binaire du fichier physique et laisse Axios configurer le Content-Type boundary
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

// BLOB STREAMING : Force Axios à traiter la réponse sous forme de données binaires pour éviter d'altérer le fichier PDF encodé
const lireRapport = async (nomFichier) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await axios.get(`${API_URL}/rapports/${nomFichier}`, {
        responseType: 'blob', // On dit à React que ce n'est pas du texte, mais un fichier binaire
        headers: {
            'Authorization': `Bearer ${user?.token}` // Ajout de la sécurité
        }
    });
    return response.data;
};

// PERSISTANCE ÉVALUATION : Transmet la note et le commentaire au backend en s'authentifiant via les en-têtes HTTP
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
  evaluerStage
};

export default stageService;