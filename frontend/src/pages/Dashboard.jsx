import React from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // On récupère les infos de l'utilisateur stockées tout à l'heure
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout(); // On vide le localStorage
    navigate('/'); // On le renvoie vers la page de connexion
  };

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
      <h1>Bienvenue sur le Tableau de Bord ! 🚀</h1>
      {user && (
        <p>
          Connecté avec : <b>{user.email}</b>
        </p>
      )}
      <button 
        onClick={handleLogout}
        style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default Dashboard;