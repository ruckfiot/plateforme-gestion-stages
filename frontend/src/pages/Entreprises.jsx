import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Entreprises = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const [entreprises] = useState([
    { id: 1, nom: "TechCorp", adresse: "Paris", contact: "contact@techcorp.fr", secteur: "Informatique" },
    { id: 2, nom: "DataSync", adresse: "Lyon", contact: "hr@datasync.io", secteur: "Big Data" },
    { id: 3, nom: "WebSolutions", adresse: "Bordeaux", contact: "info@websolutions.com", secteur: "Digital" },
  ]);

  return (
    // Ajout de textAlign: 'left' pour contrer le CSS par défaut de Vite
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      {/* HEADER 100% IDENTIQUE À STAGES */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>Gestion des Entreprises</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa', fontSize: '16px' }}>
            Connecté en tant que <b style={{ color: '#ffffff' }}>{user?.email}</b>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/accueil')} style={{ padding: '10px 20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            Retour à l'accueil
          </button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            Se déconnecter
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Rechercher une entreprise..." 
          style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2f33', color: 'white', width: '300px', fontSize: '14px' }} 
        />
        <button style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
          + Ajouter une entreprise
        </button>
      </div>

      <div style={{ backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444', color: '#aaaaaa' }}>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Nom</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Secteur</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Contact</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entreprises.map((ent) => (
              <tr key={ent.id} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 'bold' }}>{ent.nom}</td>
                <td style={{ padding: '15px 10px', color: '#dddddd' }}>{ent.secteur}</td>
                <td style={{ padding: '15px 10px', color: '#3498db' }}>{ent.contact}</td>
                <td style={{ padding: '15px 10px' }}>
                  <button style={{ marginRight: '10px', padding: '8px 12px', cursor: 'pointer', backgroundColor: '#36393f', color: '#ffffff', border: '1px solid #555', borderRadius: '5px', fontSize: '13px' }}>Modifier</button>
                  <button style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#e74c3c', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Entreprises;