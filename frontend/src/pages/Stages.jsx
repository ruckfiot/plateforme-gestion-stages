import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Stages = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Mocks : Fausses données en attendant le Backend
  const [stages, setStages] = useState([
    { id: 1, sujet: "Développement d'une API React/Spring", entreprise: "TechCorp", tuteur: "M. Dupont", etat: "en_cours" },
    { id: 2, sujet: "Refonte de la base de données", entreprise: "DataSync", tuteur: "Mme Martin", etat: "valide" },
    { id: 3, sujet: "Création d'un Dashboard Admin", entreprise: "WebSolutions", tuteur: "En attente", etat: "en_attente" },
  ]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  // Couleurs des badges adaptées au mode sombre
  const getBadgeStyle = (etat) => {
    switch(etat) {
      case 'valide': return { backgroundColor: '#27ae60', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
      case 'en_cours': return { backgroundColor: '#2980b9', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
      case 'en_attente': return { backgroundColor: '#d35400', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
      default: return { backgroundColor: '#7f8c8d', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* HEADER SOMBRE ET PRO */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px', 
        borderBottom: '1px solid #444', 
        paddingBottom: '20px' 
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>Gestion des Stages</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa', fontSize: '16px' }}>
            Connecté en tant que <b style={{ color: '#ffffff' }}>{user?.email}</b> (Rôle: {user?.role})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {/* Nouveau bouton pour naviguer */}
          <button 
            onClick={() => navigate('/accueil')} 
            style={{ padding: '10px 20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            Retour à l'accueil
          </button>
          <button 
            onClick={handleLogout} 
            style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            Se déconnecter
          </button>
        </div>
      </div>

      {/* STATISTIQUES EN MODE CARTE SOMBRE */}
      <div style={{ display: 'flex', gap: '25px', marginBottom: '40px' }}>
        <div style={{ flex: 1, padding: '25px', backgroundColor: '#2c2f33', borderRadius: '10px', textAlign: 'center', boxShadow: '0 8px 15px rgba(0,0,0,0.2)', borderTop: '5px solid #3498db' }}>
          <h3 style={{ margin: 0, color: '#3498db', fontSize: '28px' }}>{stages.length}</h3>
          <span style={{ fontSize: '15px', color: '#aaaaaa' }}>Stages Totaux</span>
        </div>
        <div style={{ flex: 1, padding: '25px', backgroundColor: '#2c2f33', borderRadius: '10px', textAlign: 'center', boxShadow: '0 8px 15px rgba(0,0,0,0.2)', borderTop: '5px solid #2ecc71' }}>
          <h3 style={{ margin: 0, color: '#2ecc71', fontSize: '28px' }}>1</h3>
          <span style={{ fontSize: '15px', color: '#aaaaaa' }}>Stages Validés</span>
        </div>
      </div>

      {/* TABLEAU SOMBRE */}
      <div style={{ backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}>
        <h2 style={{ marginTop: 0, color: '#ffffff', marginBottom: '20px' }}>Liste des Stages</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444', color: '#aaaaaa' }}>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Sujet</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Entreprise</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Tuteur</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Statut</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => (
              <tr key={stage.id} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 'bold' }}>{stage.sujet}</td>
                <td style={{ padding: '15px 10px', color: '#dddddd' }}>{stage.entreprise}</td>
                <td style={{ padding: '15px 10px', color: '#dddddd' }}>{stage.tuteur}</td>
                <td style={{ padding: '15px 10px' }}>
                  <span style={getBadgeStyle(stage.etat)}>
                    {stage.etat.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '15px 10px' }}>
                  {/* Boutons d'action redesignés */}
                  <button style={{ marginRight: '10px', padding: '8px 12px', cursor: 'pointer', backgroundColor: '#3498db', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>Voir</button>
                  <button style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#36393f', color: '#ffffff', border: '1px solid #555', borderRadius: '5px', fontSize: '13px' }}>Modifier</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Stages;