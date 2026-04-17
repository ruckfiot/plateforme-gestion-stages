import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService'; // Vérifie que le chemin remonte bien d'un dossier (../)

const Login = () => {
  // On crée les "mémoires" pour le formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // L'outil magique pour changer de page
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche la page de se recharger (comportement par défaut d'HTML)
    setError(''); // On efface les anciennes erreurs à chaque nouvelle tentative

    try {
      // 1. On tente d'envoyer la requête au backend
      await authService.login(email, password);

      // 2. Si le backend dit "OK" (pas d'erreur), on téléporte l'utilisateur !
      navigate('/dashboard');

    } catch (err) {
      // 3. Si le backend renvoie une erreur (ex: 401 Unauthorized), on l'affiche
      setError('Email ou mot de passe incorrect.');
      console.error("Erreur de connexion :", err);
    }
  };

  return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>
      <h2>Connexion SIGL Stages</h2>

      {/* Affichage du message d'erreur s'il y en a un */}
      {error && <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{error}</p>}

      {/* Le formulaire */}
      <form onSubmit={handleLogin} style={{ display: 'inline-block', textAlign: 'left', marginTop: '20px' }}>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              padding: '12px', 
              width: '280px', 
              borderRadius: '6px', 
              border: '1px solid #444',
              backgroundColor: '#222',
              color: 'white'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              padding: '12px', 
              width: '280px', 
              borderRadius: '6px', 
              border: '1px solid #444',
              backgroundColor: '#222',
              color: 'white'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '12px 20px',
            width: '100%',
            cursor: 'pointer',
            backgroundColor: '#4CAF50', // Un beau vert pour valider
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Se connecter
        </button>
        
      </form>
    </div>
  );
};

export default Login;