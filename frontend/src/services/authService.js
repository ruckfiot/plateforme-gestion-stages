import axios from 'axios';

// L'URL exacte de l'API de ton collègue
const API_URL = 'http://localhost:8080/api/auth';

const login = async (email, password) => {
  // On envoie la requête avec les bonnes clés (motDePasse) et les bons headers
  const response = await axios.post(`${API_URL}/login`, 
    // 1. Les données au format attendu par Spring Boot
    {
      email: email,
      motDePasse: password
    },
    // 2. Les headers pour forcer la lecture en JSON
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  // Si le serveur nous répond avec un token, on sauvegarde les infos
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  // Pour se déconnecter, on vide la mémoire du navigateur
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  // Permet de récupérer le profil de l'utilisateur connecté
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  login,
  logout,
  getCurrentUser
};