import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Utilisateurs = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [tab, setTab] = useState('eleves');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const eleves = [
    { id: 1, nom: "Dupont", prenom: "Jean", promo: "M1 Info", suivi: "En attente" },
    { id: 2, nom: "Martin", prenom: "Sophie", promo: "L3 Cyber", suivi: "Validé" },
  ];

  const profs = [
    { id: 101, nom: "Lemoine", prenom: "Pierre", matiere: "Java Spring" },
    { id: 102, nom: "Guerin", prenom: "Lucie", matiere: "Réseaux" },
  ];

  // Logique de filtrage
  const listToFilter = tab === 'eleves' ? eleves : profs;
  const filteredList = listToFilter.filter(u => 
    u.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.prenom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>Gestion des Personnes</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa', fontSize: '16px' }}>
            Connecté en tant que <b style={{ color: '#ffffff' }}>{user?.email}</b>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/accueil')} style={{ padding: '10px 20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Retour à l'accueil</button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Se déconnecter</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => {setTab('eleves'); setSearchQuery('');}} style={{ padding: '10px 25px', backgroundColor: tab === 'eleves' ? '#3498db' : '#2c2f33', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Élèves</button>
          <button onClick={() => {setTab('profs'); setSearchQuery('');}} style={{ padding: '10px 25px', backgroundColor: tab === 'profs' ? '#3498db' : '#2c2f33', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Profs</button>
        </div>
        <input 
          type="text" 
          placeholder={`Rechercher un ${tab === 'eleves' ? 'élève' : 'prof'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2f33', color: 'white', width: '300px' }}
        />
      </div>

      <div style={{ backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444', color: '#aaaaaa' }}>
              <th style={{ padding: '15px 10px' }}>ID</th>
              <th style={{ padding: '15px 10px' }}>Nom</th>
              <th style={{ padding: '15px 10px' }}>Prénom</th>
              <th style={{ padding: '15px 10px' }}>{tab === 'eleves' ? 'Promo' : 'Matière'}</th>
              <th style={{ padding: '15px 10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '15px 10px', color: '#aaaaaa' }}>{u.id}</td>
                <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 'bold' }}>{u.nom}</td>
                <td style={{ padding: '15px 10px', color: '#ffffff' }}>{u.prenom}</td>
                <td style={{ padding: '15px 10px', color: '#dddddd' }}>{u.promo || u.matiere}</td>
                <td style={{ padding: '15px 10px' }}>
                  <button style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: '#36393f', color: '#ffffff', border: '1px solid #555', borderRadius: '5px', cursor: 'pointer' }}>Modifier</button>
                  <button style={{ padding: '8px 12px', backgroundColor: '#e74c3c', color: '#ffffff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Utilisateurs;