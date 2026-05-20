import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Stages = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  // --- FAUSSES DONNÉES ---
  const [stages, setStages] = useState([
    { 
      id: 1, sujet: "Développement d'une API React", entreprise: "TechCorp", 
      tuteur: "M. Lemoine", etudiant: "Jean Dupont", etat: "en_cours", 
      rapport: null, noteRapport: null, noteSoutenance: null,
      dateDebut: "2026-04-01", duree: "6 mois", objectifs: "Créer une API RESTful robuste et sécurisée.", dateSoutenance: "2026-09-15"
    },
    { 
      id: 2, sujet: "Refonte de la base de données", entreprise: "DataSync", 
      tuteur: "Mme Guerin", etudiant: "Sophie Martin", etat: "valide", 
      rapport: "rapport_v1.pdf", noteRapport: 16, noteSoutenance: 14,
      dateDebut: "2026-01-10", duree: "3 mois", objectifs: "Optimiser les requêtes SQL et migrer vers PostgreSQL.", dateSoutenance: "2026-04-20"
    },
    { 
      id: 3, sujet: "Création d'un Dashboard", entreprise: "WebSolutions", 
      tuteur: "M. Lemoine", etudiant: "Lucas Blanc", etat: "en_attente", 
      rapport: "cahier_charges.pdf", noteRapport: null, noteSoutenance: null,
      dateDebut: "2026-05-15", duree: "4 mois", objectifs: "Mettre en place un tableau de bord analytique.", dateSoutenance: "2026-10-01"
    },
  ]);

  const entreprisesList = ["TechCorp", "DataSync", "WebSolutions", "DevSoft"];
  const profsList = ["M. Lemoine", "Mme Guerin", "M. Dubois"];
  const elevesList = ["Jean Dupont", "Sophie Martin", "Lucas Blanc", "Amélie Petit"];

  // --- ÉTATS DES MODALES ET RECHERCHE ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewModalData, setViewModalData] = useState(null); 
  const [editModalData, setEditModalData] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedFile, setSelectedFile] = useState(null); // NOUVEAU : Fichier sélectionné par l'étudiant

  const [createFormData, setCreateFormData] = useState({
    sujet: '', entreprise: '', tuteur: '', etudiant: '', dateDebut: '', duree: '', objectifs: ''
  });

  // --- ACTIONS SIMULÉES VERS LE BACKEND ---
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newStage = { id: Date.now(), ...createFormData, etat: 'en_attente', rapport: null, noteRapport: null, noteSoutenance: null };
    setStages([...stages, newStage]);
    setIsCreateOpen(false);
    setCreateFormData({ sujet: '', entreprise: '', tuteur: '', etudiant: '', dateDebut: '', duree: '', objectifs: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setStages(stages.map(s => s.id === editModalData.id ? editModalData : s));
    setEditModalData(null);
  };

  // NOUVEAU : LOGIQUE D'UPLOAD DU RAPPORT
  const handleUploadRapport = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    // TODO: Remplacer par Axios FormData -> axios.post(`/api/stages/${viewModalData.id}/rapport`, formData)
    const updatedStage = { ...viewModalData, rapport: selectedFile.name };
    
    setStages(stages.map(s => s.id === viewModalData.id ? updatedStage : s));
    setViewModalData(updatedStage); // Met à jour la modale en direct
    setSelectedFile(null);
    alert(`Fichier "${selectedFile.name}" téléversé avec succès !`);
  };

  const handleDelete = (id) => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce stage ?")) {
      setStages(stages.filter(s => s.id !== id));
      setEditModalData(null);
    }
  };

  // --- LOGIQUE D'AFFICHAGE SELON LE RÔLE ---
  let displayedStages = stages;
  let titrePage = "Gestion des Stages";

  if (user?.role === 'ENSEIGNANT') {
    titrePage = "Mes Stages Supervisés";
    displayedStages = stages.filter(stage => stage.tuteur === "M. Lemoine");
  } else if (user?.role === 'APPRENANT') {
    titrePage = "Mes Stages";
    displayedStages = stages.filter(stage => stage.etudiant === "Jean Dupont");
  }

  // --- LOGIQUE DE RECHERCHE ---
  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();
    displayedStages = displayedStages.filter(stage => 
      stage.sujet.toLowerCase().includes(lowerCaseQuery) ||
      stage.entreprise.toLowerCase().includes(lowerCaseQuery) ||
      stage.etudiant.toLowerCase().includes(lowerCaseQuery) ||
      stage.tuteur.toLowerCase().includes(lowerCaseQuery)
    );
  }

  const renderStatut = (stage) => {
    if (user?.role === 'ENSEIGNANT') {
      if (stage.noteRapport !== null && stage.noteSoutenance !== null) {
        return <span style={{ backgroundColor: '#27ae60', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>ÉVALUÉ</span>;
      } else if (stage.rapport !== null) {
        return <span style={{ backgroundColor: '#e67e22', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>À NOTER</span>;
      } else {
        return <span style={{ backgroundColor: '#7f8c8d', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>ATTENTE RAPPORT</span>;
      }
    } else {
      let bgColor = '#7f8c8d';
      if (stage.etat === 'valide') bgColor = '#27ae60';
      if (stage.etat === 'en_cours') bgColor = '#2980b9';
      if (stage.etat === 'en_attente') bgColor = '#d35400';
      
      return <span style={{ backgroundColor: bgColor, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
        {stage.etat.replace('_', ' ').toUpperCase()}
      </span>;
    }
  };

  // --- STYLES RÉUTILISABLES MODALES ---
  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalStyle = { backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '500px', borderTop: '5px solid #3498db', maxHeight: '90vh', overflowY: 'auto' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1e2124', color: '#fff', boxSizing: 'border-box', marginBottom: '15px' };
  const labelStyle = { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' };

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1100px', boxSizing: 'border-box', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>{titrePage}</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa', fontSize: '16px' }}>Connecté en tant que <b style={{ color: '#ffffff' }}>{user?.email}</b> (Rôle: {user?.role})</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/accueil')} style={{ padding: '10px 20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Retour à l'accueil</button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Se déconnecter</button>
        </div>
      </div>

      {/* BARRE D'ACTIONS : RECHERCHE ET CRÉATION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <input 
          type="text" 
          placeholder="Rechercher un stage (sujet, entreprise, élève)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#2c2f33', color: 'white', width: '350px' }} 
        />
        {user?.role === 'ADMIN' && (
          <button onClick={() => setIsCreateOpen(true)} style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            + Créer un stage
          </button>
        )}
      </div>

      {/* TABLEAU */}
      <div style={{ backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444', color: '#aaaaaa' }}>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Sujet</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Entreprise</th>
              {user?.role !== 'APPRENANT' && <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Élève</th>}
              {user?.role !== 'ENSEIGNANT' && <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Tuteur</th>}
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Statut</th>
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedStages.length > 0 ? (
              displayedStages.map((stage) => (
                <tr key={stage.id} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 'bold' }}>{stage.sujet}</td>
                  <td style={{ padding: '15px 10px', color: '#dddddd' }}>{stage.entreprise}</td>
                  {user?.role !== 'APPRENANT' && <td style={{ padding: '15px 10px', color: '#dddddd' }}>{stage.etudiant}</td>}
                  {user?.role !== 'ENSEIGNANT' && <td style={{ padding: '15px 10px', color: '#dddddd' }}>{stage.tuteur}</td>}
                  <td style={{ padding: '15px 10px' }}>{renderStatut(stage)}</td>
                  
                  <td style={{ padding: '15px 10px' }}>
                    {user?.role === 'ADMIN' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setViewModalData(stage)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#3498db', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>Voir</button>
                        <button onClick={() => setEditModalData(stage)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#36393f', color: '#ffffff', border: '1px solid #555', borderRadius: '5px', fontSize: '13px' }}>Modifier</button>
                      </div>
                    )}
                    
                    {user?.role === 'ENSEIGNANT' && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => navigate(`/evaluations?id=${stage.id}`)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#f39c12', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>Évaluer</button>
                        <button onClick={() => setViewModalData(stage)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#3498db', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>Voir</button>
                      </div>
                    )}

                    {user?.role === 'APPRENANT' && (
                      <button onClick={() => { setViewModalData(stage); setSelectedFile(null); }} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#3498db', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                        Voir mon dossier
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#aaaaaa' }}>Aucun stage ne correspond à votre recherche.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================
          MODALE 1 : CRÉER UN STAGE (POST)
      ========================================================= */}
      {isCreateOpen && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, borderTopColor: '#2ecc71' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Créer un nouveau stage</h2>
            <form onSubmit={handleCreateSubmit}>
              <label style={labelStyle}>Sujet du stage</label>
              <input type="text" required style={inputStyle} value={createFormData.sujet} onChange={(e) => setCreateFormData({...createFormData, sujet: e.target.value})} />
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Élève</label>
                  <select required style={inputStyle} value={createFormData.etudiant} onChange={(e) => setCreateFormData({...createFormData, etudiant: e.target.value})}>
                    <option value="">Sélectionner...</option>
                    {elevesList.map((e, i) => <option key={i} value={e}>{e}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Entreprise</label>
                  <select required style={inputStyle} value={createFormData.entreprise} onChange={(e) => setCreateFormData({...createFormData, entreprise: e.target.value})}>
                    <option value="">Sélectionner...</option>
                    {entreprisesList.map((e, i) => <option key={i} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>
              <label style={labelStyle}>Tuteur Enseignant</label>
              <select required style={inputStyle} value={createFormData.tuteur} onChange={(e) => setCreateFormData({...createFormData, tuteur: e.target.value})}>
                <option value="">Sélectionner...</option>
                {profsList.map((p, i) => <option key={i} value={p}>{p}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Date de début</label>
                  <input type="date" required style={inputStyle} value={createFormData.dateDebut} onChange={(e) => setCreateFormData({...createFormData, dateDebut: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Durée (ex: 6 mois)</label>
                  <input type="text" required style={inputStyle} value={createFormData.duree} onChange={(e) => setCreateFormData({...createFormData, duree: e.target.value})} />
                </div>
              </div>
              <label style={labelStyle}>Objectifs</label>
              <textarea required rows="3" style={{ ...inputStyle, resize: 'none' }} value={createFormData.objectifs} onChange={(e) => setCreateFormData({...createFormData, objectifs: e.target.value})}></textarea>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsCreateOpen(false)} style={{ padding: '10px 15px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Annuler</button>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODALE 2 : DETAILS DU STAGE + ZONE DE DEPOT (APPRENANT)
      ========================================================= */}
      {viewModalData && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Détails du stage</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#ddd', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              <div style={{ gridColumn: 'span 2', paddingBottom: '10px', borderBottom: '1px solid #444' }}>
                <span style={{ color: '#aaa', fontSize: '12px', display: 'block' }}>Sujet et Objectifs</span>
                <b style={{ color: '#fff', fontSize: '16px' }}>{viewModalData.sujet}</b>
                <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', color: '#bbb' }}>"{viewModalData.objectifs}"</p>
              </div>
              <div><span style={{ color: '#aaa', display: 'block' }}>Élève :</span> <b>{viewModalData.etudiant}</b></div>
              <div><span style={{ color: '#aaa', display: 'block' }}>Entreprise :</span> <b>{viewModalData.entreprise}</b></div>
              <div><span style={{ color: '#aaa', display: 'block' }}>Tuteur :</span> <b>{viewModalData.tuteur}</b></div>
              <div><span style={{ color: '#aaa', display: 'block' }}>Date de début :</span> <b>{viewModalData.dateDebut || 'Non définie'}</b></div>
              <div><span style={{ color: '#aaa', display: 'block' }}>Durée :</span> <b>{viewModalData.duree || 'Non définie'}</b></div>
              <div><span style={{ color: '#aaa', display: 'block' }}>Date soutenance :</span> <b>{viewModalData.dateSoutenance || 'À planifier'}</b></div>
            </div>

            {/* SYSTÈME DE GESTION DU RAPPORTÉ ÉCRIT */}
            <div style={{ borderTop: '1px solid #444', paddingTop: '15px' }}>
              <h3 style={{ color: '#fff', fontSize: '15px', margin: '0 0 10px 0' }}>📄 Document du Rapport</h3>
              
              {viewModalData.rapport ? (
                <div style={{ backgroundColor: '#2ecc7115', border: '1px dashed #2ecc71', padding: '15px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ color: '#2ecc71', fontWeight: 'bold', display: 'block', fontSize: '13px' }}>Fichier en ligne :</span>
                    <a href="#" style={{ color: '#fff', fontSize: '14px', textDecoration: 'underline' }}>{viewModalData.rapport}</a>
                  </div>
                  <span style={{ color: '#aaa', fontSize: '11px' }}>Prêt pour évaluation</span>
                </div>
              ) : user?.role === 'APPRENANT' ? (
                // Formulaire d'upload réservé uniquement à l'étudiant s'il n'a rien déposé
                <form onSubmit={handleUploadRapport}>
                  <div style={{ backgroundColor: '#1e2124', border: '2px dashed #555', padding: '20px', borderRadius: '6px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                    <div style={{ fontSize: '30px', marginBottom: '8px' }}>📤</div>
                    <span style={{ color: '#fff', fontSize: '13px', display: 'block' }}>
                      {selectedFile ? `Fichier sélectionné : ${selectedFile.name}` : 'Cliquez ou glissez votre rapport ici (.pdf, .docx)'}
                    </span>
                  </div>
                  {selectedFile && (
                    <button type="submit" style={{ width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#9b59b6', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Confirmer le téléversement
                    </button>
                  )}
                </form>
              ) : (
                <span style={{ color: '#e74c3c', fontSize: '14px', fontWeight: 'bold' }}>Aucun document n'a été déposé pour le moment.</span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px' }}>
              <button onClick={() => setViewModalData(null)} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODALE 3 : MODIFIER LE STAGE EN ENTIER (PUT / DELETE)
      ========================================================= */}
      {editModalData && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, borderTopColor: '#f39c12' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Modifier le stage</h2>
            <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '20px' }}>Modification du dossier de : <b style={{ color: '#fff' }}>{editModalData.etudiant}</b></p>
            <form onSubmit={handleEditSubmit}>
              <label style={labelStyle}>État actuel du stage</label>
              <select style={inputStyle} value={editModalData.etat} onChange={(e) => setEditModalData({...editModalData, etat: e.target.value})}>
                <option value="en_attente">En attente (Non commencé)</option>
                <option value="en_cours">En cours</option>
                <option value="valide">Validé (Terminé)</option>
              </select>
              <label style={labelStyle}>Sujet du stage</label>
              <input type="text" required style={inputStyle} value={editModalData.sujet} onChange={(e) => setEditModalData({...editModalData, sujet: e.target.value})} />
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Entreprise</label>
                  <select required style={inputStyle} value={editModalData.entreprise} onChange={(e) => setEditModalData({...editModalData, entreprise: e.target.value})}>
                    {entreprisesList.map((e, i) => <option key={i} value={e}>{e}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Tuteur Enseignant</label>
                  <select required style={inputStyle} value={editModalData.tuteur} onChange={(e) => setEditModalData({...editModalData, tuteur: e.target.value})}>
                    {profsList.map((p, i) => <option key={i} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Date de début</label>
                  <input type="date" required style={inputStyle} value={editModalData.dateDebut} onChange={(e) => setEditModalData({...editModalData, dateDebut: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Durée</label>
                  <input type="text" required style={inputStyle} value={editModalData.duree} onChange={(e) => setEditModalData({...editModalData, duree: e.target.value})} />
                </div>
              </div>
              <label style={labelStyle}>Objectifs</label>
              <textarea required rows="3" style={{ ...inputStyle, resize: 'none' }} value={editModalData.objectifs} onChange={(e) => setEditModalData({...editModalData, objectifs: e.target.value})}></textarea>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #444' }}>
                <button type="button" onClick={() => handleDelete(editModalData.id)} style={{ padding: '10px 15px', backgroundColor: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Supprimer</button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setEditModalData(null)} style={{ padding: '10px 15px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Annuler</button>
                  <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Enregistrer les modifications</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Stages;