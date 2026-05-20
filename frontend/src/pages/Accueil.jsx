import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Accueil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const switchRole = (newRole) => {
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const getMessageActualite = () => {
    const today = new Date();
    const deadline = new Date('2026-05-30'); 

    if (today > deadline) {
      return (
        <>
          <li>⚠️ La période de rendu est <b>terminée</b>.</li>
          <li>Veuillez préparer vos supports de soutenance.</li>
        </>
      );
    } else {
      return (
        <>
          <li>La date limite de dépôt du rapport est fixée au <b style={{ color: '#fff' }}>30 Mai</b>.</li>
          <li>N'oubliez pas de faire signer votre convention par l'entreprise.</li>
        </>
      );
    }
  };

  // --- STYLES RÉUTILISABLES ---
  const sectionTitleStyle = { color: '#fff', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: '0' };
  const actionButtonStyle = { backgroundColor: '#34495e', width: '280px', padding: '20px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)', cursor: 'pointer', transition: '0.2s', textAlign: 'center' };

  // --- RENDU : APPRENANT ---
  const renderApprenantDashboard = () => (
    <div>
      <h2 style={sectionTitleStyle}>Mon Aperçu</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', width: '100%', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #3498db' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Mon Stage Actuel</h3>
          <p style={{ color: '#aaa', margin: '5px 0', fontSize: '14px' }}>Entreprise : <b style={{ color: '#fff' }}>TechCorp</b></p>
          <p style={{ color: '#aaa', margin: '5px 0', fontSize: '14px' }}>Sujet : <b style={{ color: '#fff' }}>Développement API React</b></p>
          <p style={{ color: '#aaa', margin: '5px 0', fontSize: '14px' }}>Tuteur : <b style={{ color: '#fff' }}>M. Lemoine</b></p>
          <div style={{ marginTop: '15px', padding: '8px', backgroundColor: 'rgba(41, 128, 185, 0.2)', color: '#3498db', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>STATUT : EN COURS</div>
        </div>

        <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #2ecc71' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Mes Évaluations</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #444' }}>
            <span style={{ color: '#aaa', fontSize: '14px' }}>Rapport écrit</span><b style={{ color: '#f1c40f' }}>En attente</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#aaa', fontSize: '14px' }}>Soutenance orale</span><b style={{ color: '#f1c40f' }}>En attente</b>
          </div>
        </div>

        <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #f39c12' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Actualités</h3>
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#dddddd', fontSize: '14px', lineHeight: '1.6' }}>
            {getMessageActualite()}
          </ul>
        </div>
      </div>

      <h2 style={sectionTitleStyle}>Accès Rapide</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div onClick={() => navigate('/stages')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Mon Espace Stage</h3>
          <p style={{ color: '#ccc', fontSize: '13px', marginTop: '10px' }}>Déposer mon rapport ou consulter les détails</p>
        </div>
      </div>
    </div>
  );

  // --- RENDU : ENSEIGNANT ---
  const renderEnseignantDashboard = () => (
    <div>
      <h2 style={sectionTitleStyle}>Aperçu du Suivi</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', width: '100%', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #9b59b6' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Mon Suivi</h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}>Vous encadrez actuellement <b style={{ color: '#fff', fontSize: '18px' }}>5</b> étudiants.</p>
        </div>

        <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #e74c3c' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>À faire</h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}><b style={{ color: '#e74c3c', fontSize: '18px' }}>2</b> rapports attendent votre évaluation.</p>
        </div>
      </div>

      <h2 style={sectionTitleStyle}>Accès Rapide</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div onClick={() => navigate('/stages')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Mes Stages Supervisés</h3>
          <p style={{ color: '#aaa', fontSize: '13px', marginTop: '8px' }}>Mettre à jour les statuts</p>
        </div>
        <div onClick={() => navigate('/evaluations')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Espace Évaluations</h3>
          <p style={{ color: '#aaa', fontSize: '13px', marginTop: '8px' }}>Noter les étudiants</p>
        </div>
      </div>
    </div>
  );

  // --- RENDU : ADMIN ---
  const renderAdminDashboard = () => {
    // Simulation des données en attente (à remplacer par Axios plus tard)
    const nbAttente = 2; 

    return (
      <div>
        <h2 style={sectionTitleStyle}>Vue d'ensemble Globale</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', width: '100%', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #3498db' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Chiffres Clés</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '14px', marginBottom: '8px' }}><span>Stages actifs :</span> <b style={{ color: '#fff' }}>24</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '14px', marginBottom: '8px' }}><span>Entreprises partenaires :</span> <b style={{ color: '#fff' }}>12</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '14px' }}><span>Utilisateurs :</span> <b style={{ color: '#fff' }}>145</b></div>
          </div>

          {/* Nouvelle carte avec le bouton d'action pour les inscriptions */}
          <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #e67e22' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Alertes Administratives</h3>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.4' }}>
              <b style={{ color: '#e67e22', fontSize: '18px' }}>{nbAttente}</b> demandes d'inscription sont en attente de validation.
            </p>
            <button 
              onClick={() => navigate('/utilisateurs')}
              style={{ marginTop: '10px', backgroundColor: 'transparent', border: '1px solid #e67e22', color: '#e67e22', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              Voir les demandes
            </button>
          </div>
        </div>

        <h2 style={sectionTitleStyle}> Gestion & Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div onClick={() => navigate('/stages')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Gérer les Stages</h3>
          </div>
          <div onClick={() => navigate('/entreprises')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Gérer les Entreprises</h3>
          </div>
          <div onClick={() => navigate('/utilisateurs')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Gestion des Comptes</h3>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1100px', boxSizing: 'border-box', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      {/* SÉLECTEUR DE TEST (À retirer en prod) */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px dashed #555' }}>
        <span style={{ color: '#aaa', marginRight: '15px', fontSize: '12px' }}>MODE TEST :</span>
        <button onClick={() => switchRole('ADMIN')} style={{ marginRight: '5px', fontSize: '11px', cursor: 'pointer' }}>Admin</button>
        <button onClick={() => switchRole('ENSEIGNANT')} style={{ marginRight: '5px', fontSize: '11px', cursor: 'pointer' }}>Enseignant</button>
        <button onClick={() => switchRole('APPRENANT')} style={{ fontSize: '11px', cursor: 'pointer' }}>Apprenant</button>
      </div>

      {/* HEADER AVEC LE BOUTON PARAMÈTRES (ROUAGE) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>Tableau de bord</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa' }}>Bienvenue, <b style={{ color: '#fff' }}>{user?.email}</b></p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => navigate('/parametres')}
            style={{ padding: '10px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Paramètres"
          >
            ⚙️
          </button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Se déconnecter
          </button>
        </div>
      </div>

      {/* AFFICHAGE CONDITIONNEL SELON LE RÔLE */}
      {user?.role === 'APPRENANT' && renderApprenantDashboard()}
      {user?.role === 'ENSEIGNANT' && renderEnseignantDashboard()}
      {user?.role === 'ADMIN' && renderAdminDashboard()}

    </div>
  );
};

export default Accueil;