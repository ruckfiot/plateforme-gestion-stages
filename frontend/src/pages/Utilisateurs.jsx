import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import utilisateurService from '../services/utilisateurService';
import { useNavigate } from 'react-router-dom';

const Utilisateurs = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [tab, setTab] = useState('eleves');   // INTERFACE : État basculant l'affichage entre le panneau des Apprenants et celui des Enseignants
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // --- ÉTATS DYNAMIQUES (VRAIE BDD) ---
  const [eleves, setEleves] = useState([]);
  const [profs, setProfs] = useState([]);
  const [promotionsList, setPromotionsList] = useState([]);

  // --- ÉTATS DES MODALES ---
  const [editModalData, setEditModalData] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const listeMatieres = [
    "Anglais", 
    "Mathématiques", 
    "Développement web", 
    "Réseau et télécommunications", 
    "Cybersécurité", 
    "IA", 
    "Électronique"
  ];

  // --- FORMULAIRE DE CRÉATION ---
  const [createFormData, setCreateFormData] = useState({
    role: 'APPRENANT', 
    prenom: '',
    nom: '',
    email: '',
    motDePasse: ''
  });

  // --- CHARGEMENT DES DONNÉES ---
  // AGRÉGATION PAR PARALLÉLISME : Récupère simultanément les collections métiers et académiques de la base de données
  const fetchData = async () => {
    setLoading(true);
    try {
      const apprenantsData = await utilisateurService.getApprenants();
      const enseignantsData = await utilisateurService.getEnseignants();
      const promosData = await utilisateurService.getPromotions();
      
      setEleves(apprenantsData);
      setProfs(enseignantsData);
      setPromotionsList(promosData);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => { 
    authService.logout(); 
    navigate('/'); 
  };

  // --- ACTION DE CRÉATION DE COMPTE ---
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        nom: createFormData.nom,
        prenom: createFormData.prenom,
        email: createFormData.email,
        motDePasse: createFormData.motDePasse,
        role: createFormData.role
      };

      await authService.register(newUser);
      
      fetchData(); 
      setIsCreateOpen(false); 
      setCreateFormData({ role: 'APPRENANT', prenom: '', nom: '', email: '', motDePasse: '' });
      
    } catch (err) {
      console.error("Erreur d'inscription :", err.response?.data || err);
      alert("Erreur lors de la création du compte. Vérifiez les rôles ou l'email.");
    }
  };

  // --- ACTIONS DE VALIDATION RAPIDE ---
  // MODIFICATION DE STATUT VIA L'API : Force le statut à 'VALIDE' tout en conservant la promotion de l'élève pour le backend
  const validerCompte = async (u) => {
    try {
      const currentId = u.idApprenant || u.idEnseignant;
      const updatedUser = { ...u, statut: 'VALIDE' };
      if (tab === 'eleves') {
        // on transmet l'idPromotion actuel pour ne pas le perdre
        const idPromoCurrent = u.promotion ? u.promotion.idPromotion : null;  // SÉCURITÉ CONFLIT DE MERGE : Conserve la promotion existante lors d'une approbation de compte
        await utilisateurService.updateApprenant(currentId, updatedUser, idPromoCurrent);
      } else {
        await utilisateurService.updateEnseignant(currentId, updatedUser);
      }
      fetchData(); 
    } catch (err) {
      alert("Erreur lors de la validation.");
    }
  };

  const refuserCompte = async (u) => {
    if (window.confirm("Refuser et supprimer cette demande d'inscription ?")) {
      try {
        const currentId = u.idApprenant || u.idEnseignant;
        if (tab === 'eleves') {
          await utilisateurService.deleteApprenant(currentId);
        } else {
          await utilisateurService.deleteEnseignant(currentId);
        }
        fetchData();
      } catch (err) {
        alert("Erreur lors de la suppression. Ce compte est probablement lié à un stage.");
      }
    }
  };

  // --- ACTIONS DE MODIFICATION (MODALE GÉRER) ---
  // REQUÊTE COMPOSITE PAR APPRENANT : Récupère et transmet l'ID de promotion explicitement sélectionné dans le formulaire
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentId = editModalData.idApprenant || editModalData.idEnseignant;
      if (tab === 'eleves') {
        // on extrait l'idPromotion du formulaire
        const idPromoSelected = editModalData.idPromotion !== undefined 
          ? editModalData.idPromotion 
          : (editModalData.promotion ? editModalData.promotion.idPromotion : null);   // SÉCURISATION PROMOTION : Évite d'envoyer une valeur nulle lors d'une mise à jour de compte apprenant
        
        await utilisateurService.updateApprenant(currentId, editModalData, idPromoSelected);
      } else {
        await utilisateurService.updateEnseignant(currentId, editModalData);
      }
      fetchData();
      setEditModalData(null);
    } catch (err) {
      alert("Erreur lors de la modification.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce compte ?")) {
      try {
        if (tab === 'eleves') {
          await utilisateurService.deleteApprenant(id);
        } else {
          await utilisateurService.deleteEnseignant(id);
        }
        fetchData();
        setEditModalData(null);
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  // --- LOGIQUE DE RECHERCHE ---
  // COMMUTATION DU JEU DE DONNÉES : Aligne la source de données à filtrer sur l'onglet actif sélectionné par l'administrateur
  const listToFilter = tab === 'eleves' ? eleves : profs;
  let filteredList = listToFilter;

  // MOTEUR DE TRACABILITÉ LOCAL : Filtrage multicritère (Nom, Prénom, Promotion, Matière) s'exécutant entièrement côté client
  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();
    filteredList = listToFilter.filter(u => 
      (u.nomApprenant && u.nomApprenant.toLowerCase().includes(lowerCaseQuery)) || 
      (u.prenomApprenant && u.prenomApprenant.toLowerCase().includes(lowerCaseQuery)) ||
      (u.nomEnseignant && u.nomEnseignant.toLowerCase().includes(lowerCaseQuery)) ||
      (u.prenomEnseignant && u.prenomEnseignant.toLowerCase().includes(lowerCaseQuery)) ||
      (u.promotion && u.promotion.nom && u.promotion.nom.toLowerCase().includes(lowerCaseQuery)) || 
      (u.matiere && u.matiere.toLowerCase().includes(lowerCaseQuery))
    );
  }

  // --- STYLES RÉUTILISABLES ---
  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalStyle = { backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', width: '400px', borderTop: '5px solid #3498db', boxShadow: '0 15px 25px rgba(0,0,0,0.5)' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1e2124', color: '#fff', boxSizing: 'border-box', marginBottom: '15px' };
  const labelStyle = { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' };

  if (loading) return <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>Chargement des utilisateurs...</div>;

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

      {/* BARRE D'ACTIONS RÉORGANISÉE : Onglets | Recherche | Création */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        
        {/* GAUCHE : Onglets */}
        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
          <button onClick={() => { setTab('eleves'); setSearchQuery(''); }} style={{ padding: '10px 25px', backgroundColor: tab === 'eleves' ? '#3498db' : '#2c2f33', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Élèves</button>
          <button onClick={() => { setTab('profs'); setSearchQuery(''); }} style={{ padding: '10px 25px', backgroundColor: tab === 'profs' ? '#3498db' : '#2c2f33', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Profs</button>
        </div>
        
        {/* MILIEU : Barre de recherche */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder={`Rechercher un ${tab === 'eleves' ? 'élève' : 'professeur'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2f33', color: 'white', width: '100%', maxWidth: '350px' }} 
          />
        </div>

        {/* DROITE : Bouton Créer */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setIsCreateOpen(true)} style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            + Créer un compte
          </button>
        </div>

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
              filteredList.map((u) => {
                const currentId = u.idApprenant || u.idEnseignant || u.id; 
                const nomAffiche = u.nomApprenant || u.nomEnseignant || u.nom || "Inconnu";
                const prenomAffiche = u.prenomApprenant || u.prenomEnseignant || u.prenom || "";
                const currentStatut = u.statut || 'EN_ATTENTE';

                return (
                  <tr key={currentId} style={{ borderBottom: '1px solid #444' }}>
                    <td style={{ padding: '15px 10px', color: '#ffffff' }}><b>{nomAffiche}</b> {prenomAffiche}</td>
                    
                    {/* <-- Affichage dynamique de la promo ou de la matière --> */}
                    <td style={{ padding: '15px 10px', color: '#dddddd' }}>
                      {tab === 'eleves' ? (u.promotion ? u.promotion.nom : '-') : (u.matiere || '-')}
                    </td>
                    
                    <td style={{ padding: '15px 10px' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                        backgroundColor: currentStatut === 'VALIDE' ? '#2ecc7120' : '#e67e2220',
                        color: currentStatut === 'VALIDE' ? '#2ecc71' : '#e67e22',
                        border: `1px solid ${currentStatut === 'VALIDE' ? '#2ecc71' : '#e67e22'}`
                      }}>
                        {currentStatut}
                      </span>
                    </td>
                    <td style={{ padding: '15px 10px' }}>
                      {currentStatut === 'EN_ATTENTE' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => validerCompte(u)} style={{ padding: '6px 10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Valider</button>
                          <button onClick={() => refuserCompte(u)} style={{ padding: '6px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Refuser</button>
                        </div>
                      ) : (
                        <button onClick={() => setEditModalData(u)} style={{ padding: '6px 10px', backgroundColor: '#36393f', color: '#ffffff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                          Gérer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#aaaaaa' }}>Aucun compte ne correspond à votre recherche.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================
          MODALE 1 : CRÉER UN NOUVEAU COMPTE
      ========================================================= */}
      {isCreateOpen && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, borderTopColor: '#2ecc71' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Créer un Utilisateur</h2>
            <form onSubmit={handleCreateSubmit}>
              
              <label style={labelStyle}>Type de compte</label>
              <select 
                required 
                style={inputStyle} 
                value={createFormData.role} 
                onChange={(e) => setCreateFormData({...createFormData, role: e.target.value})}
              >
                <option value="APPRENANT">Élève</option>
                <option value="ENSEIGNANT">Professeur</option>
              </select>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Prénom</label>
                  <input type="text" required style={inputStyle} value={createFormData.prenom} onChange={(e) => setCreateFormData({...createFormData, prenom: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Nom</label>
                  <input type="text" required style={inputStyle} value={createFormData.nom} onChange={(e) => setCreateFormData({...createFormData, nom: e.target.value})} />
                </div>
              </div>

              <label style={labelStyle}>Adresse Email</label>
              <input type="email" required placeholder="email@ecole.fr" style={inputStyle} value={createFormData.email} onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})} />

              <label style={labelStyle}>Mot de passe temporaire</label>
              <input type="password" required placeholder="••••••••" style={inputStyle} value={createFormData.motDePasse} onChange={(e) => setCreateFormData({...createFormData, motDePasse: e.target.value})} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #444' }}>
                <button type="button" onClick={() => setIsCreateOpen(false)} style={{ padding: '10px 15px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Annuler
                </button>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Créer le compte
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODALE 2 : GÉRER UN COMPTE EXISTANT (MODIFIER / SUPPRIMER)
      ========================================================= */}
      {editModalData && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Gérer le compte</h2>
            <form onSubmit={handleEditSubmit}>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Prénom</label>
                  <input 
                    type="text" 
                    required 
                    style={inputStyle} 
                    value={tab === 'eleves' ? (editModalData.prenomApprenant || '') : (editModalData.prenomEnseignant || '')} 
                    onChange={(e) => {
                      if (tab === 'eleves') setEditModalData({...editModalData, prenomApprenant: e.target.value});
                      else setEditModalData({...editModalData, prenomEnseignant: e.target.value});
                    }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Nom</label>
                  <input 
                    type="text" 
                    required 
                    style={inputStyle} 
                    value={tab === 'eleves' ? (editModalData.nomApprenant || '') : (editModalData.nomEnseignant || '')} 
                    onChange={(e) => {
                      if (tab === 'eleves') setEditModalData({...editModalData, nomApprenant: e.target.value});
                      else setEditModalData({...editModalData, nomEnseignant: e.target.value});
                    }} 
                  />
                </div>
              </div>

              {tab === 'eleves' ? (
                <>
                  <label style={labelStyle}>Promotion / Filière</label>
                  {/* <--  Boucle sur les données de la base --> */}
                  <select 
                    style={inputStyle} 
                    value={editModalData.idPromotion !== undefined ? editModalData.idPromotion : (editModalData.promotion ? editModalData.promotion.idPromotion : '')} 
                    onChange={(e) => setEditModalData({...editModalData, idPromotion: e.target.value})}
                  >
                    <option value="">Sélectionner une promo...</option>
                    {promotionsList.map((promo) => (
                      <option key={promo.idPromotion} value={promo.idPromotion}>
                        {promo.nom} ({promo.annee})
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label style={labelStyle}>Matière enseignée</label>
                  <select 
                    style={inputStyle} 
                    value={editModalData.matiere || ''} 
                    onChange={(e) => setEditModalData({...editModalData, matiere: e.target.value})}
                  >
                    <option value="">Sélectionner une matière...</option>
                    {listeMatieres.map((matiere, index) => (
                      <option key={index} value={matiere}>{matiere}</option>
                    ))}
                  </select>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #444' }}>
                <button type="button" onClick={() => handleDelete(editModalData.idApprenant || editModalData.idEnseignant)} style={{ padding: '10px 15px', backgroundColor: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
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