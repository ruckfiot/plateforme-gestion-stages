import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, 
    { email: email, motDePasse: password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const register = async ({ nom, prenom, email, motDePasse, role }) => {
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
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  login,
  register, // N'oublie pas de l'exporter ici
  logout,
  getCurrentUser
};