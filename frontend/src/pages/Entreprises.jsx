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

  // --- ÉTAT : LISTE DES ENTREPRISES (SIMULATION BDD) ---
  const [entreprises, setEntreprises] = useState([
    { id: 1, nom: "TechCorp", secteur: "Informatique", contact: "contact@techcorp.fr", adresse: "12 rue de la Paix, Paris" },
    { id: 2, nom: "DataSync", secteur: "Big Data", contact: "hr@datasync.io", adresse: "45 avenue Jean Jaurès, Lyon" },
    { id: 3, nom: "WebSolutions", secteur: "Digital", contact: "info@websolutions.com", adresse: "8 place de la Bourse, Bordeaux" },
  ]);

  // --- ÉTATS DES MODALES ET RECHERCHE ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(''); // État pour la barre de recherche

  const [createFormData, setCreateFormData] = useState({
    nom: '', secteur: '', contact: '', adresse: ''
  });

  // --- ACTIONS VERS LE BACKEND (SIMULÉES) ---
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newEnt = { id: Date.now(), ...createFormData };
    setEntreprises([...entreprises, newEnt]);
    setIsCreateOpen(false);
    setCreateFormData({ nom: '', secteur: '', contact: '', adresse: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEntreprises(entreprises.map(ent => ent.id === editModalData.id ? editModalData : ent));
    setEditModalData(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette entreprise ? Cela pourrait impacter les stages liés.")) {
      setEntreprises(entreprises.filter(ent => ent.id !== id));
    }
  };

  // --- LOGIQUE DE RECHERCHE ---
  let displayedEntreprises = entreprises;
  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();
    displayedEntreprises = entreprises.filter(ent => 
      ent.nom.toLowerCase().includes(lowerCaseQuery) ||
      ent.secteur.toLowerCase().includes(lowerCaseQuery) ||
      ent.adresse.toLowerCase().includes(lowerCaseQuery) ||
      ent.contact.toLowerCase().includes(lowerCaseQuery)
    );
  }

  // --- STYLES RÉUTILISABLES ---
  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalStyle = { backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', width: '400px', borderTop: '5px solid #2ecc71', boxShadow: '0 15px 25px rgba(0,0,0,0.5)' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1e2124', color: '#fff', boxSizing: 'border-box', marginBottom: '15px' };
  const labelStyle = { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' };

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1100px', boxSizing: 'border-box', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>Gestion des Entreprises</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa', fontSize: '16px' }}>Connecté en tant que <b style={{ color: '#ffffff' }}>{user?.email}</b></p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/accueil')} style={{ padding: '10px 20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Retour à l'accueil</button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Se déconnecter</button>
        </div>
      </div>

      {/* BARRE D'ACTIONS : RECHERCHE CONNECTÉE ET AJOUT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Rechercher une entreprise (nom, secteur, adresse)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2f33', color: 'white', width: '350px' }} 
        />
        <button 
          onClick={() => setIsCreateOpen(true)}
          style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Ajouter une entreprise
        </button>
      </div>

      {/* TABLEAU */}
      <div style={{ backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444', color: '#aaaaaa' }}>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Nom</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Secteur</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Adresse</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Contact</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedEntreprises.length > 0 ? (
              displayedEntreprises.map((ent) => (
                <tr key={ent.id} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 'bold' }}>{ent.nom}</td>
                  <td style={{ padding: '15px 10px', color: '#dddddd' }}>{ent.secteur}</td>
                  <td style={{ padding: '15px 10px', color: '#dddddd', fontSize: '14px' }}>{ent.adresse}</td>
                  <td style={{ padding: '15px 10px', color: '#3498db' }}>{ent.contact}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <button 
                      onClick={() => setEditModalData(ent)}
                      style={{ marginRight: '10px', padding: '8px 12px', cursor: 'pointer', backgroundColor: '#36393f', color: '#ffffff', border: '1px solid #555', borderRadius: '5px', fontSize: '13px' }}>
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(ent.id)}
                      style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#e74c3c', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#aaaaaa' }}>
                  Aucune entreprise ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODALE 1 : CRÉATION */}
      {isCreateOpen && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Nouvelle Entreprise</h2>
            <form onSubmit={handleCreateSubmit}>
              <label style={labelStyle}>Nom (Raison Sociale)</label>
              <input type="text" required style={inputStyle} value={createFormData.nom} onChange={(e) => setCreateFormData({...createFormData, nom: e.target.value})} />
              
              <label style={labelStyle}>Secteur d'activité</label>
              <input type="text" required style={inputStyle} value={createFormData.secteur} onChange={(e) => setCreateFormData({...createFormData, secteur: e.target.value})} />
              
              <label style={labelStyle}>Email de contact</label>
              <input type="email" required style={inputStyle} value={createFormData.contact} onChange={(e) => setCreateFormData({...createFormData, contact: e.target.value})} />

              <label style={labelStyle}>Adresse</label>
              <input type="text" required style={inputStyle} value={createFormData.adresse} onChange={(e) => setCreateFormData({...createFormData, adresse: e.target.value})} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsCreateOpen(false)} style={{ padding: '10px 15px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Annuler</button>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE 2 : MODIFICATION */}
      {editModalData && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, borderTopColor: '#3498db' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Modifier l'entreprise</h2>
            <form onSubmit={handleEditSubmit}>
              <label style={labelStyle}>Nom (Raison Sociale)</label>
              <input type="text" required style={inputStyle} value={editModalData.nom} onChange={(e) => setEditModalData({...editModalData, nom: e.target.value})} />
              
              <label style={labelStyle}>Secteur d'activité</label>
              <input type="text" required style={inputStyle} value={editModalData.secteur} onChange={(e) => setEditModalData({...editModalData, secteur: e.target.value})} />
              
              <label style={labelStyle}>Email de contact</label>
              <input type="email" required style={inputStyle} value={editModalData.contact} onChange={(e) => setEditModalData({...editModalData, contact: e.target.value})} />

              <label style={labelStyle}>Adresse</label>
              <input type="text" required style={inputStyle} value={editModalData.adresse} onChange={(e) => setEditModalData({...editModalData, adresse: e.target.value})} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setEditModalData(null)} style={{ padding: '10px 15px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Annuler</button>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Entreprises;