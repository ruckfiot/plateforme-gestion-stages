import React, { useState, useEffect } from 'react';
import entreprisesService from '../services/entrepriseService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Entreprises = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  // --- ÉTAT DYNAMIQUE ---
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ÉTATS DES MODALES ET RECHERCHE ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(''); 

  const [createFormData, setCreateFormData] = useState({
    raisonSociale: '', contact: '', adresse: ''
  });

  // Appel au Backend au chargement de la page
  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        // On utilise la fonction de Gaétan (qui s'appelle getAllStages suite au copier-coller)
        const data = await entreprisesService.getAllStages(); 
        setEntreprises(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des entreprises :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntreprises();
  }, []);

  // --- ACTIONS VERS LE BACKEND (SIMULÉES POUR LA CRÉATION/MODIF POUR LE MOMENT) ---
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newEnt = { idEntreprise: Date.now(), ...createFormData };
    setEntreprises([...entreprises, newEnt]);
    setIsCreateOpen(false);
    setCreateFormData({ raisonSociale: '', contact: '', adresse: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEntreprises(entreprises.map(ent => ent.idEntreprise === editModalData.idEntreprise ? editModalData : ent));
    setEditModalData(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer cette entreprise ? Cela pourrait impacter les stages liés.")) {
      setEntreprises(entreprises.filter(ent => ent.idEntreprise !== id));
    }
  };

  // --- LOGIQUE DE RECHERCHE ---
  let displayedEntreprises = entreprises;
  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();
    displayedEntreprises = entreprises.filter(ent => 
      (ent.raisonSociale && ent.raisonSociale.toLowerCase().includes(lowerCaseQuery)) ||
      (ent.adresse && ent.adresse.toLowerCase().includes(lowerCaseQuery)) ||
      (ent.contact && ent.contact.toLowerCase().includes(lowerCaseQuery))
    );
  }

  // --- STYLES RÉUTILISABLES ---
  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalStyle = { backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', width: '400px', borderTop: '5px solid #2ecc71', boxShadow: '0 15px 25px rgba(0,0,0,0.5)' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1e2124', color: '#fff', boxSizing: 'border-box', marginBottom: '15px' };
  const labelStyle = { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' };

  if (loading) {
    return (
      <div style={{ padding: '40px', color: '#fff', backgroundColor: '#1a1a1a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        Connexion au serveur et chargement des entreprises...
      </div>
    );
  }

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
          placeholder="Rechercher une entreprise (nom, adresse, contact)..." 
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
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Nom (Raison Sociale)</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Adresse</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Contact</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedEntreprises.length > 0 ? (
              displayedEntreprises.map((ent) => (
                <tr key={ent.idEntreprise} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 'bold' }}>{ent.raisonSociale}</td>
                  <td style={{ padding: '15px 10px', color: '#dddddd', fontSize: '14px' }}>{ent.adresse}</td>
                  <td style={{ padding: '15px 10px', color: '#3498db' }}>{ent.contact}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <button 
                      onClick={() => setEditModalData(ent)}
                      style={{ marginRight: '10px', padding: '8px 12px', cursor: 'pointer', backgroundColor: '#36393f', color: '#ffffff', border: '1px solid #555', borderRadius: '5px', fontSize: '13px' }}>
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(ent.idEntreprise)}
                      style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#e74c3c', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#aaaaaa' }}>
                  Aucune entreprise n'est enregistrée dans la base de données.
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
              <input type="text" required style={inputStyle} value={createFormData.raisonSociale} onChange={(e) => setCreateFormData({...createFormData, raisonSociale: e.target.value})} />
              
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
              <input type="text" required style={inputStyle} value={editModalData.raisonSociale} onChange={(e) => setEditModalData({...editModalData, raisonSociale: e.target.value})} />
              
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