import axios from 'axios';

// ENDPOINT CIBLE : URL de base pointant vers le contrôleur d'authentification de notre API REST Spring Boot
const API_URL = 'http://localhost:8080/api/auth';

const login = async (email, password) => {
  // POST PAYLOAD : Envoi des identifiants au format JSON en faisant correspondre la clé Java 'motDePasse'
  const response = await axios.post(`${API_URL}/login`, 
    { email: email, motDePasse: password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  // PERSISTANCE LOCALES : Stocke l'objet JwtResponse complet (Token, Email, Rôle, Statut) en chaîne JSON dans le navigateur
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const register = async ({ nom, prenom, email, motDePasse, role }) => {
  // DTO INSCRIPTION : Transmet les attributs de création d'un compte utilisateur en attente d'approbation administrative
  const response = await axios.post(`${API_URL}/register`, {
    nom,
    prenom,
    email,
    motDePasse,
    role
  });
  return response.data;
};

const logout = () => {
  // PURGE DU STOCKAGE : Supprime la session locale et invalide de fait l'accès aux routes privées (ProtectedRoute)
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  // DESERIALISATION : Extrait la chaîne brute du LocalStorage et la retransforme en objet JavaScript manipulable
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  login,
  register,
  logout,
  getCurrentUser
};