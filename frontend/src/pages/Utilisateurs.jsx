import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Utilisateurs = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [tab, setTab] = useState('eleves');
  const [searchQuery, setSearchQuery] = useState('');

  // --- FAUSSES DONNÉES ---
  const [eleves, setEleves] = useState([
    { id: 1, nom: "Dupont", prenom: "Jean", promo: "M1 Info", statut: "VALIDE" },
    { id: 2, nom: "Martin", prenom: "Sophie", promo: "L3 Cyber", statut: "VALIDE" },
    { id: 3, nom: "Gerard", prenom: "Lucas", promo: "M1 Info", statut: "EN_ATTENTE" },
    { id: 4, nom: "Petit", prenom: "Amélie", promo: "L3 Cyber", statut: "EN_ATTENTE" },
  ]);

  const [profs, setProfs] = useState([
    { id: 101, nom: "Lemoine", prenom: "Pierre", matiere: "Java Spring", statut: "VALIDE" },
    { id: 102, nom: "Guerin", prenom: "Marie", matiere: "Bases de données", statut: "VALIDE" },
  ]);

  // --- ÉTAT MODALE ---
  const [editModalData, setEditModalData] = useState(null); // Utilisateur en cours d'édition

  const handleLogout = () => { authService.logout(); navigate('/'); };

  // --- ACTIONS DE VALIDATION RAPIDE ---
  const validerCompte = (id) => {
    // TODO: Axios PUT -> /api/utilisateurs/{id}/valider
    if (tab === 'eleves') {
      setEleves(eleves.map(e => e.id === id ? { ...e, statut: 'VALIDE' } : e));
    } else {
      setProfs(profs.map(p => p.id === id ? { ...p, statut: 'VALIDE' } : p));
    }
  };

  const refuserCompte = (id) => {
    // TODO: Axios DELETE -> /api/utilisateurs/{id}
    if (window.confirm("Refuser et supprimer cette demande d'inscription ?")) {
      if (tab === 'eleves') {
        setEleves(eleves.filter(e => e.id !== id));
      } else {
        setProfs(profs.filter(p => p.id !== id));
      }
    }
  };

  // --- ACTIONS DE MODIFICATION (MODALE) ---
  const handleEditSubmit = (e) => {
    e.preventDefault();
    // TODO: Axios PUT -> /api/utilisateurs/{editModalData.id}
    if (tab === 'eleves') {
      setEleves(eleves.map(el => el.id === editModalData.id ? editModalData : el));
    } else {
      setProfs(profs.map(pr => pr.id === editModalData.id ? editModalData : pr));
    }
    setEditModalData(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce compte ?")) {
      // TODO: Axios DELETE -> /api/utilisateurs/{id}
      if (tab === 'eleves') {
        setEleves(eleves.filter(e => e.id !== id));
      } else {
        setProfs(profs.filter(p => p.id !== id));
      }
      setEditModalData(null);
    }
  };

  // --- LOGIQUE DE RECHERCHE ---
  const listToFilter = tab === 'eleves' ? eleves : profs;
  let filteredList = listToFilter;

  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();
    filteredList = listToFilter.filter(u => 
      u.nom.toLowerCase().includes(lowerCaseQuery) || 
      u.prenom.toLowerCase().includes(lowerCaseQuery) ||
      (u.promo && u.promo.toLowerCase().includes(lowerCaseQuery)) ||
      (u.matiere && u.matiere.toLowerCase().includes(lowerCaseQuery))
    );
  }

  // --- STYLES RÉUTILISABLES ---
  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalStyle = { backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', width: '400px', borderTop: '5px solid #3498db', boxShadow: '0 15px 25px rgba(0,0,0,0.5)' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1e2124', color: '#fff', boxSizing: 'border-box', marginBottom: '15px' };
  const labelStyle = { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' };

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1100px', boxSizing: 'border-box', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>Gestion des Comptes</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa', fontSize: '16px' }}>Connecté en tant que <b style={{ color: '#ffffff' }}>{user?.email}</b></p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/accueil')} style={{ padding: '10px 20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Retour à l'accueil</button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Se déconnecter</button>
        </div>
      </div>

      {/* BARRE D'ACTIONS : ONGLETS ET RECHERCHE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => { setTab('eleves'); setSearchQuery(''); }} style={{ padding: '10px 25px', backgroundColor: tab === 'eleves' ? '#3498db' : '#2c2f33', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Élèves</button>
          <button onClick={() => { setTab('profs'); setSearchQuery(''); }} style={{ padding: '10px 25px', backgroundColor: tab === 'profs' ? '#3498db' : '#2c2f33', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Profs</button>
        </div>
        <input 
          type="text" 
          placeholder={`Rechercher un ${tab === 'eleves' ? 'élève' : 'professeur'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2f33', color: 'white', width: '300px' }} 
        />
      </div>

      {/* TABLEAU */}
      <div style={{ backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444', color: '#aaaaaa' }}>
              <th style={{ padding: '15px 10px', textAlign: 'left', fontWeight: 'normal' }}>Nom / Prénom</th>
              <th style={{ padding: '15px 10px', textAlign: 'left', fontWeight: 'normal' }}>{tab === 'eleves' ? 'Promo' : 'Matière'}</th>
              <th style={{ padding: '15px 10px', textAlign: 'left', fontWeight: 'normal' }}>Statut</th>
              <th style={{ padding: '15px 10px', textAlign: 'left', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length > 0 ? (
              filteredList.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '15px 10px', color: '#ffffff' }}><b>{u.nom}</b> {u.prenom}</td>
                  <td style={{ padding: '15px 10px', color: '#dddddd' }}>{u.promo || u.matiere}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: u.statut === 'VALIDE' ? '#2ecc7120' : '#e67e2220',
                      color: u.statut === 'VALIDE' ? '#2ecc71' : '#e67e22',
                      border: `1px solid ${u.statut === 'VALIDE' ? '#2ecc71' : '#e67e22'}`
                    }}>
                      {u.statut}
                    </span>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    {u.statut === 'EN_ATTENTE' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => validerCompte(u.id)} style={{ padding: '6px 10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Valider</button>
                        <button onClick={() => refuserCompte(u.id)} style={{ padding: '6px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Refuser</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditModalData(u)} style={{ padding: '6px 10px', backgroundColor: '#36393f', color: '#ffffff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                        Gérer
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#aaaaaa' }}>Aucun compte ne correspond à votre recherche.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================
          MODALE : GÉRER UN COMPTE (MODIFIER / SUPPRIMER)
      ========================================================= */}
      {editModalData && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Gérer le compte</h2>
            <form onSubmit={handleEditSubmit}>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Prénom</label>
                  <input type="text" required style={inputStyle} value={editModalData.prenom} onChange={(e) => setEditModalData({...editModalData, prenom: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Nom</label>
                  <input type="text" required style={inputStyle} value={editModalData.nom} onChange={(e) => setEditModalData({...editModalData, nom: e.target.value})} />
                </div>
              </div>

              {/* Champ dynamique selon si c'est un élève ou un prof */}
              {tab === 'eleves' ? (
                <>
                  <label style={labelStyle}>Promotion / Filière</label>
                  <input type="text" required style={inputStyle} value={editModalData.promo} onChange={(e) => setEditModalData({...editModalData, promo: e.target.value})} />
                </>
              ) : (
                <>
                  <label style={labelStyle}>Matière enseignée</label>
                  <input type="text" required style={inputStyle} value={editModalData.matiere} onChange={(e) => setEditModalData({...editModalData, matiere: e.target.value})} />
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #444' }}>
                <button type="button" onClick={() => handleDelete(editModalData.id)} style={{ padding: '10px 15px', backgroundColor: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  Supprimer le compte
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setEditModalData(null)} style={{ padding: '10px 15px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Annuler
                  </button>
                  <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Sauvegarder
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Utilisateurs;