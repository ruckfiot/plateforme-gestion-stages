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

  const getMenuOptions = () => {
    switch(user?.role) {
      case 'ADMIN':
        return [
          { title: 'Gestion des Stages', desc: 'Créer, affecter et gérer les jurys', path: '/stages' },
          { title: 'Gestion des Entreprises', desc: 'CRUD entreprises partenaires', path: '/entreprises' },
          { title: 'Gestion des Personnes', desc: 'Gérer les élèves, les profs et leurs affectations', path: '/utilisateurs' }
        ];
      case 'ENSEIGNANT':
        return [
          { title: 'Mes Stages Supervisés', desc: 'Suivre mes étudiants et mettre à jour les états', path: '/stages' },
          { title: 'Évaluations', desc: 'Noter les rapports et les soutenances', path: '/evaluations' }
        ];
      case 'APPRENANT':
        return [
          { title: 'Mon Espace Stage', desc: 'Consulter mon suivi, déposer mon rapport et voir mes notes', path: '/stages' }
        ];
      default: return [];
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      width: '100%',             /* <-- CORRECTION: Force la largeur */
      maxWidth: '1000px', 
      boxSizing: 'border-box',   /* <-- CORRECTION: Gère le padding proprement */
      margin: '0 auto', 
      fontFamily: 'sans-serif' 
    }}>
      
      <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px dashed #555' }}>
        <span style={{ color: '#aaa', marginRight: '15px', fontSize: '12px' }}>MODE TEST :</span>
        <button onClick={() => switchRole('ADMIN')} style={{ marginRight: '5px', fontSize: '11px', cursor: 'pointer' }}>Admin</button>
        <button onClick={() => switchRole('ENSEIGNANT')} style={{ marginRight: '5px', fontSize: '11px', cursor: 'pointer' }}>Enseignant</button>
        <button onClick={() => switchRole('APPRENANT')} style={{ fontSize: '11px', cursor: 'pointer' }}>Apprenant</button>
      </div>

      {/* L'en-tête restera maintenant toujours espacé au maximum */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>Accueil Espace {user?.role}</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa' }}>Bienvenue, <b style={{ color: '#fff' }}>{user?.email}</b></p>
        </div>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Se déconnecter</button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '25px' }}>
        {getMenuOptions().map((menu, index) => (
          <div 
            key={index} 
            onClick={() => navigate(menu.path)}
            style={{ backgroundColor: '#2c2f33', width: '280px', padding: '30px 20px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)', cursor: 'pointer', borderTop: '5px solid #3498db', transition: '0.2s', textAlign: 'center' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#36393f'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2c2f33'}
          >
            <h3 style={{ color: '#fff', fontSize: '18px' }}>{menu.title}</h3>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.4' }}>{menu.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accueil;