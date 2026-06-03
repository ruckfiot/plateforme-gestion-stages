import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  // Les différentes vues : 'login', 'register', 'pending-request', 'pending-login'
  const [view, setView] = useState('login'); 

  // ÉTATS DES FORMULAIRES
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // --- LOGIQUE DE CONNEXION ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.login(email, password);
      
      if (userData.statut === 'EN_ATTENTE') {
          setView('pending-login');
          authService.logout(); // On le déconnecte par sécurité
          setLoading(false);
          return;
      }
      
      navigate('/accueil');
    } catch (err) {
      setError("Erreur de connexion. Vérifiez vos identifiants ou attendez la validation de l'admin.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIQUE D'INSCRIPTION BRANCHÉE AU BACKEND ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // On envoie la demande avec le rôle par défaut 'APPRENANT'
      await authService.register({ nom, prenom, email, motDePasse: password, role: "APPRENANT" });
      setView('pending-request'); 
    } catch (err) {
      setError(err.response?.data || "Erreur lors de l'inscription. L'email est peut-être déjà utilisé.");
    } finally {
      setLoading(false);
    }
  };

  const changeView = (newView) => {
    setView(newView);
    setError('');
  };

  // --- STYLES ---
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e2124', color: '#ffffff', fontSize: '15px', boxSizing: 'border-box' };
  const labelStyle = { color: '#aaaaaa', fontSize: '13px', display: 'block', marginBottom: '8px' };
  const linkStyle = { color: '#3498db', fontSize: '14px', textDecoration: 'none', cursor: 'pointer', fontWeight: 'bold' };
  const boxCardStyle = { 
    backgroundColor: '#2c2f33', padding: '40px', borderRadius: '10px', boxShadow: '0 15px 30px rgba(0,0,0,0.5)', width: '100%', maxWidth: '400px',
    borderTop: `5px solid ${view === 'register' ? '#2ecc71' : view.startsWith('pending') ? '#e67e22' : '#3498db'}`,
    transition: 'border-color 0.3s' 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: '#1a1a1a', fontFamily: 'sans-serif' }}>
      
      <div style={boxCardStyle}>
        
        {/* VUE 1 : CONNEXION (LOGIN) */}
        {view === 'login' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ color: '#ffffff', margin: '0 0 10px 0', fontSize: '28px' }}>Plateforme Stages</h1>
              <p style={{ color: '#aaaaaa', margin: 0, fontSize: '14px' }}>Connectez-vous à votre espace</p>
            </div>

            {error && <div style={{ backgroundColor: '#e74c3c20', color: '#e74c3c', padding: '12px', borderRadius: '5px', marginBottom: '20px', fontSize: '13px', border: '1px solid #e74c3c', lineHeight: '1.4' }}>{error}</div>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Adresse Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nom@exemple.com" style={inputStyle} required />
              </div>
              <div>
                {/* Suppression du "Mot de passe oublié ?" */}
                <label style={labelStyle}>Mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} required />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444', textAlign: 'center' }}>
              <p style={{ color: '#aaaaaa', fontSize: '14px', margin: 0 }}>
                Pas encore de compte ? <span onClick={() => changeView('register')} style={{ ...linkStyle, color: '#2ecc71' }}>S'inscrire (Élève)</span>
              </p>
            </div>
          </>
        )}

        {/* VUE 2 : INSCRIPTION (REGISTER) */}
        {view === 'register' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ color: '#ffffff', margin: '0 0 10px 0', fontSize: '28px' }}>Inscription</h1>
              <p style={{ color: '#aaaaaa', margin: 0, fontSize: '14px' }}>Demander un accès à la plateforme</p>
            </div>

            {error && <div style={{ backgroundColor: '#e74c3c20', color: '#e74c3c', padding: '12px', borderRadius: '5px', marginBottom: '20px', fontSize: '13px', border: '1px solid #e74c3c', lineHeight: '1.4' }}>{error}</div>}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Prénom</label>
                  <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} style={inputStyle} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Nom</label>
                  <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} style={inputStyle} required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Adresse Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="etudiant@ecole.fr" style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} required />
              </div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                {loading ? 'Création...' : 'Créer ma demande'}
              </button>
            </form>
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #444', textAlign: 'center' }}>
              <span onClick={() => changeView('login')} style={linkStyle}>← Retour à la connexion</span>
            </div>
          </>
        )}

        {/* VUE 3 : DEMANDE ENVOYÉE */}
        {view === 'pending-request' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>📩</div>
            <h1 style={{ color: '#ffffff', margin: '0 0 15px 0', fontSize: '24px' }}>Demande envoyée !</h1>
            <div style={{ backgroundColor: '#e67e2220', color: '#e67e22', padding: '15px', borderRadius: '6px', marginBottom: '25px', border: '1px solid #e67e22', fontSize: '14px', lineHeight: '1.5', textAlign: 'left' }}>
              Votre demande d'inscription a bien été transmise. Un administrateur doit valider votre identité avant que vous ne puissiez accéder à l'application. Veuillez patienter.
            </div>
            <button onClick={() => changeView('login')} style={{ width: '100%', padding: '12px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Retour à la connexion
            </button>
          </div>
        )}

        {/* VUE 4 : TENTATIVE DE LOGIN EN ATTENTE */}
        {view === 'pending-login' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '50px', marginBottom: '20px' }}>⏳</div>
            <h1 style={{ color: '#ffffff', margin: '0 0 15px 0', fontSize: '24px' }}>Validation en cours</h1>
            <div style={{ backgroundColor: '#e67e2220', color: '#e67e22', padding: '15px', borderRadius: '6px', marginBottom: '25px', border: '1px solid #e67e22', fontSize: '14px', lineHeight: '1.5', textAlign: 'left' }}>
              Votre compte est toujours en cours de vérification par l'administration.
            </div>
            <button onClick={() => changeView('login')} style={{ width: '100%', padding: '12px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Compris
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;