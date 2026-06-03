import axios from 'axios';

// On crée une instance d'Axios pointant vers ton Spring Boot
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// L'intercepteur : le "Vigile de sortie"
api.interceptors.request.use(
  (config) => {
    // On va chercher les infos de l'utilisateur dans le navigateur
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Si on a trouvé un token, on l'accroche à la requête !
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;