import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import stageService from '../services/stageService';
import entrepriseService from '../services/entrepriseService';
import utilisateurService from '../services/utilisateurService';
import { useNavigate } from 'react-router-dom';

const Stages = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [stages, setStages] = useState([]);
  const [entreprisesList, setEntreprisesList] = useState([]);
  const [profsList, setProfsList] = useState([]);
  const [elevesList, setElevesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [dateSoutenance, setDateSoutenance] = useState('');
  const [salleSoutenance, setSalleSoutenance] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      let stagesData = [];
      if (user?.role === 'ADMIN') {
        stagesData = await stageService.getAllStages();
        const entData = await entrepriseService.getAllEntreprises();
        const profsData = await utilisateurService.getEnseignants();
        const elevesData = await utilisateurService.getApprenants();
        
        setEntreprisesList(entData);
        setProfsList(profsData);
        setElevesList(elevesData);
      } else if (user?.role === 'ENSEIGNANT') {
        stagesData = await stageService.getStagesByTuteur();
      } else if (user?.role === 'APPRENANT') {
        stagesData = await stageService.getStagesByApprenant();
      }
      setStages(stagesData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      if (error.response && error.response.status === 403) {
        alert("Accès refusé. Veuillez vous reconnecter.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.role]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewModalData, setViewModalData] = useState(null); 
  const [editModalData, setEditModalData] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedFile, setSelectedFile] = useState(null);

  const [createFormData, setCreateFormData] = useState({
    sujet: '', 
    entrepriseId: '', 
    tuteurId: '', 
    etudiantId: '', 
    dateDebut: '', 
    duree: '', 
    objectifs: '',
    dateLimiteRapport: ''
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const stageBody = {
        sujet: createFormData.sujet,
        objectif: createFormData.objectifs,
        dateDebut: createFormData.dateDebut,
        duree: createFormData.duree,
        etat: 'EN_COURS',
        dateLimiteRapport: createFormData.dateLimiteRapport || null
      };

      await stageService.createStage(
        stageBody, 
        createFormData.etudiantId, 
        createFormData.tuteurId, 
        createFormData.entrepriseId
      );
      
      fetchData();
      setIsCreateOpen(false);
      setCreateFormData({ sujet: '', entrepriseId: '', tuteurId: '', etudiantId: '', dateDebut: '', duree: '', objectifs: '', dateLimiteRapport: '' });
    } catch (err) {
      alert("Erreur lors de la création du stage.");
    }
  };

  const openEditModal = (stage) => {
    setEditModalData(stage);
    const laSoutenance = stage.soutenances && stage.soutenances.length > 0 ? stage.soutenances[0] : null;
    setDateSoutenance(laSoutenance?.dateSoutenance ? laSoutenance.dateSoutenance.split('T')[0] : (stage.dateSoutenance ? stage.dateSoutenance.split('T')[0] : ''));
    setSalleSoutenance(laSoutenance?.salle || '');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const idStage = editModalData.idStage || editModalData.id;
      const idApprenant = editModalData.apprenant?.idApprenant;
      const idEntreprise = editModalData.entreprise?.idEntreprise;
      const idTuteur = editModalData.tuteurId || editModalData.tuteur?.idEnseignant;

      const stageBody = {
        idStage: idStage,
        sujet: editModalData.sujet,
        dateDebut: editModalData.dateDebut,
        duree: editModalData.duree,
        objectif: editModalData.objectif,
        etat: editModalData.etat,
        dateSoutenance: dateSoutenance || null, 
        salleSoutenance: salleSoutenance || null,
        dateLimiteRapport: editModalData.dateLimiteRapport || null
      };

      await stageService.updateStage(idStage, stageBody, idApprenant, idTuteur, idEntreprise);
      fetchData(); 
      setEditModalData(null); 
    } catch (err) {
      console.error("Erreur de mise à jour du stage :", err);
      alert("Erreur lors de la modification du stage.");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce stage ?")) {
      try {
        await stageService.deleteStage(id);
        fetchData();
        setEditModalData(null);
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  // --- NOUVEAUTÉ : FONCTION POUR OUVRIR LE PDF ---
  const ouvrirPDF = async (nomFichier) => {
    try {
      const blob = await stageService.lireRapport(nomFichier);
      const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ouverture du fichier.");
    }
  };

const handleUploadRapport = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Veuillez d'abord sélectionner un fichier.");
      return;
    }

    const MAX_SIZE = 20 * 1024 * 1024; // 20 Mo
    if (selectedFile.size > MAX_SIZE) {
      alert("Fichier trop volumineux (Max 20 Mo).");
      return;
    }

    try {
      const id = viewModalData.idStage || viewModalData.id;
      // L'appel est plus propre, plus besoin d'envoyer user.email !
      await stageService.deposerRapport(id, selectedFile);
      alert("Rapport déposé avec succès !");
      
      setViewModalData(null); 
      setSelectedFile(null);
      fetchData(); 
    } catch (error) {
      // Magie : Si Java renvoie une erreur 400, on l'affiche directement à l'écran !
      const messageErreur = error.response?.data ? JSON.stringify(error.response.data) : "Erreur inconnue";
      alert("Une erreur est survenue lors du dépôt : " + messageErreur);
    }
  };

  let displayedStages = stages;
  let titrePage = "Gestion des Stages";

  if (user?.role === 'ENSEIGNANT') {
    titrePage = "Mes Stages Supervisés";
  } else if (user?.role === 'APPRENANT') {
    titrePage = "Mes Stages";
  }

  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();
    displayedStages = displayedStages.filter(stage => {
      const matchSujet = (stage.titre || stage.sujet || '').toLowerCase().includes(lowerCaseQuery);
      const matchEntreprise = (stage.entreprise?.raisonSociale || '').toLowerCase().includes(lowerCaseQuery);
      const eleveFullName = stage.apprenant ? `${stage.apprenant.nomApprenant} ${stage.apprenant.prenomApprenant}`.toLowerCase() : '';
      const matchEleve = eleveFullName.includes(lowerCaseQuery);
      const tuteurFullName = stage.tuteur ? `${stage.tuteur.nomEnseignant} ${stage.tuteur.prenomEnseignant}`.toLowerCase() : '';
      const matchTuteur = tuteurFullName.includes(lowerCaseQuery);
      return matchSujet || matchEntreprise || matchEleve || matchTuteur;
    });
  }

  const renderStatut = (stage) => {
    const etatActuel = (stage.etat || 'EN_ATTENTE').toUpperCase();
    const aUnRapport = stage.rapports && stage.rapports.length > 0;
    const aUneSoutenance = stage.soutenances && stage.soutenances.length > 0;
    const noteRapport = aUnRapport ? stage.rapports[0].noteRapport : null;
    const noteSoutenance = aUneSoutenance ? stage.soutenances[0].noteSoutenance : null;

    if (noteRapport && noteSoutenance) {
      return <span style={{ backgroundColor: '#27ae60', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>VALIDÉ</span>;
    }
    
    if (aUnRapport) {
      const texte = user?.role === 'ENSEIGNANT' ? 'À ÉVALUER' : 'EN ÉVALUATION';
      return <span style={{ backgroundColor: '#e67e22', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap'  }}>{texte}</span>;
    }

    let bgColor = '#2980b9'; 
    let texteAffiche = 'EN COURS';
    if (etatActuel === 'EN_ATTENTE') {
      bgColor = '#d35400'; 
      texteAffiche = 'EN ATTENTE';
    }

    return (
      <span style={{ backgroundColor: bgColor, color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
        {texteAffiche}
      </span>
    );
  };

  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalStyle = { backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '500px', borderTop: '5px solid #3498db', maxHeight: '90vh', overflowY: 'auto' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1e2124', color: '#fff', boxSizing: 'border-box', marginBottom: '15px' };
  const labelStyle = { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' };

  if (loading) return <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>Chargement des stages...</div>;

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1100px', boxSizing: 'border-box', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <input 
          type="text" 
          placeholder="Rechercher un stage (sujet, entreprise)..." 
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
              displayedStages.map((stage) => {
                const id = stage.idStage || stage.id;
                const nomEntreprise = stage.entreprise?.raisonSociale || "Non assignée";
                const nomEleve = stage.apprenant ? `${stage.apprenant.nomApprenant} ${stage.apprenant.prenomApprenant}` : "Non assigné";
                const nomTuteur = stage.tuteur ? `${stage.tuteur.nomEnseignant} ${stage.tuteur.prenomEnseignant}` : "Non assigné";

                return(
                  <tr key={id} style={{ borderBottom: '1px solid #444' }}>
                    <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 'bold' }}>{stage.titre || stage.sujet}</td>
                    <td style={{ padding: '15px 10px', color: '#dddddd' }}>{nomEntreprise}</td>
                    {user?.role !== 'APPRENANT' && <td style={{ padding: '15px 10px', color: '#dddddd' }}>{nomEleve}</td>}
                    {user?.role !== 'ENSEIGNANT' && <td style={{ padding: '15px 10px', color: '#dddddd' }}>{nomTuteur}</td>}
                    <td style={{ padding: '15px 10px' }}>{renderStatut(stage)}</td>
                    
                    <td style={{ padding: '15px 10px' }}>
                      {user?.role === 'ADMIN' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => setViewModalData(stage)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#3498db', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>Voir</button>
                          <button onClick={() => openEditModal(stage)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#36393f', color: '#ffffff', border: '1px solid #555', borderRadius: '5px', fontSize: '13px' }}>Modifier</button>
                        </div>
                      )}
                      
                      {user?.role === 'ENSEIGNANT' && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => navigate(`/evaluations?id=${id}`)} style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#f39c12', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>Évaluer</button>
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
                )
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#aaaaaa' }}>Aucun stage ne correspond à votre recherche.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODALE 1 : CRÉER */}
      {isCreateOpen && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, borderTopColor: '#2ecc71' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Créer un nouveau stage</h2>
            <form onSubmit={handleCreateSubmit}>
              <label style={labelStyle}>Sujet du stage (Titre)</label>
              <input type="text" required style={inputStyle} value={createFormData.sujet} onChange={(e) => setCreateFormData({...createFormData, sujet: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Élève</label>
                  <select required style={inputStyle} value={createFormData.etudiantId} onChange={(e) => setCreateFormData({...createFormData, etudiantId: e.target.value})}>
                    <option value="">Sélectionner...</option>
                    {elevesList.map((e) => <option key={e.idApprenant} value={e.idApprenant}>{e.nomApprenant} {e.prenomApprenant}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Entreprise</label>
                  <select required style={inputStyle} value={createFormData.entrepriseId} onChange={(e) => setCreateFormData({...createFormData, entrepriseId: e.target.value})}>
                    <option value="">Sélectionner...</option>
                    {entreprisesList.map((e) => <option key={e.idEntreprise} value={e.idEntreprise}>{e.raisonSociale}</option>)}
                  </select>
                </div>
              </div>

              <label style={labelStyle}>Tuteur Enseignant</label>
              <select required style={inputStyle} value={createFormData.tuteurId} onChange={(e) => setCreateFormData({...createFormData, tuteurId: e.target.value})}>
                <option value="">Sélectionner...</option>
                {profsList.map((p) => <option key={p.idEnseignant} value={p.idEnseignant}>{p.nomEnseignant} {p.prenomEnseignant}</option>)}
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

              <label style={labelStyle}>Date limite de rendu du rapport</label>
              <input type="date" style={inputStyle} value={createFormData.dateLimiteRapport} onChange={(e) => setCreateFormData({...createFormData, dateLimiteRapport: e.target.value})} />

              <label style={labelStyle}>Objectifs / Description</label>
              <textarea required rows="3" style={{ ...inputStyle, resize: 'none' }} value={createFormData.objectifs} onChange={(e) => setCreateFormData({...createFormData, objectifs: e.target.value})}></textarea>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsCreateOpen(false)} style={{ padding: '10px 15px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Annuler</button>
                <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE 2 : DÉTAILS DU STAGE */}
      {viewModalData && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Détails du stage</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', color: '#ddd', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              <div style={{ gridColumn: 'span 2', paddingBottom: '10px', borderBottom: '1px solid #444' }}>
                <span style={{ color: '#aaa', fontSize: '12px', display: 'block' }}>Sujet et Description</span>
                <b style={{ color: '#fff', fontSize: '16px' }}>{viewModalData.sujet}</b>
                <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', color: '#bbb' }}>"{viewModalData.objectif}"</p>
              </div>
              
              <div>
                <span style={{ color: '#aaa', display: 'block' }}>Élève :</span> 
                <b>{viewModalData.apprenant ? `${viewModalData.apprenant.nomApprenant} ${viewModalData.apprenant.prenomApprenant}` : 'Non assigné'}</b>
              </div>
              <div>
                <span style={{ color: '#aaa', display: 'block' }}>Entreprise :</span> 
                <b>{viewModalData.entreprise?.raisonSociale || 'Non assignée'}</b>
              </div>
              <div>
                <span style={{ color: '#aaa', display: 'block' }}>Tuteur :</span> 
                <b>{viewModalData.tuteur ? `${viewModalData.tuteur.nomEnseignant} ${viewModalData.tuteur.prenomEnseignant}` : 'Non assigné'}</b>
              </div>
              <div><span style={{ color: '#aaa', display: 'block' }}>Date de début :</span> <b>{viewModalData.dateDebut || 'Non définie'}</b></div>
              <div><span style={{ color: '#aaa', display: 'block' }}>Durée :</span> <b>{viewModalData.duree || 'Non définie'}</b></div>
              <div><span style={{ color: '#aaa', display: 'block' }}>Statut :</span> <b>{viewModalData.etat || 'Non défini'}</b></div>
              
              <div><span style={{ color: '#aaa', display: 'block' }}>Date limite rapport :</span> 
                <b style={{ color: '#3498db' }}>{viewModalData.dateLimiteRapport ? viewModalData.dateLimiteRapport.split('T')[0] : 'Non définie'}</b>
              </div>
              <div></div> {/* Élément vide pour garder la grille alignée */}

              <div style={{ gridColumn: 'span 2', height: '1px', backgroundColor: '#444', margin: '5px 0' }}></div>
              
              <div>
                <span style={{ color: '#aaa', display: 'block' }}>Date de soutenance :</span> 
                <b style={{ color: '#f39c12' }}>
                  {viewModalData.soutenances && viewModalData.soutenances.length > 0 && viewModalData.soutenances[0].dateSoutenance 
                    ? viewModalData.soutenances[0].dateSoutenance.split('T')[0] 
                    : viewModalData.dateSoutenance 
                      ? viewModalData.dateSoutenance.split('T')[0] 
                      : 'Non définie'}
                </b>
              </div>
              <div>
                <span style={{ color: '#aaa', display: 'block' }}>Salle assignée :</span> 
                <b style={{ color: '#f39c12' }}>
                  {viewModalData.soutenances && viewModalData.soutenances.length > 0 && viewModalData.soutenances[0].salle 
                    ? viewModalData.soutenances[0].salle 
                    : 'Non assignée'}
                </b>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #444', paddingTop: '15px' }}>
              <h3 style={{ color: '#fff', fontSize: '15px', margin: '0 0 10px 0' }}> Document du Rapport</h3>
              
              {viewModalData.rapports && viewModalData.rapports.length > 0 && viewModalData.rapports[0].nomFichier ? (
  <div style={{ backgroundColor: '#2ecc7115', border: '1px dashed #2ecc71', padding: '15px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <span style={{ color: '#2ecc71', fontWeight: 'bold', display: 'block', fontSize: '13px' }}>Fichier en ligne :</span>
      <span 
        onClick={() => ouvrirPDF(viewModalData.rapports[0].nomFichier)} 
        style={{ color: '#fff', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }}>
        {viewModalData.rapports[0].nomFichier}
      </span>
    </div>
    {user?.role === 'APPRENANT' ? (
      <button
        onClick={async () => {
          if (window.confirm("Supprimer ce rapport ? Cette action est irréversible.")) {
            try {
              const id = viewModalData.idStage || viewModalData.id;
              await stageService.supprimerRapport(id);
              alert("Rapport supprimé avec succès.");
              setViewModalData(null);
              fetchData();
            } catch (e) {
              alert("Erreur lors de la suppression : " + e.message);
            }
          }
        }}
        style={{ padding: '7px 13px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
      >
        🗑 Supprimer
      </button>
    ) : (
      <span style={{ color: '#aaa', fontSize: '11px' }}>Prêt pour évaluation</span>
    )}
  </div>

              ) : user?.role === 'APPRENANT' ? (
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

            {/* RETOURS DE L'ENSEIGNANT */}
            {( (viewModalData.rapports && viewModalData.rapports.length > 0 && (viewModalData.rapports[0].commentaire || viewModalData.rapports[0].noteRapport)) || 
               (viewModalData.soutenances && viewModalData.soutenances.length > 0 && (viewModalData.soutenances[0].commentaireSoutenance || viewModalData.soutenances[0].noteSoutenance)) ) && (
              
              <div style={{ borderTop: '1px solid #444', paddingTop: '15px', marginTop: '20px' }}>
                <h3 style={{ color: '#fff', fontSize: '15px', margin: '0 0 15px 0' }}>Retours de l'enseignant</h3>
                
                {viewModalData.rapports && viewModalData.rapports.length > 0 && (viewModalData.rapports[0].commentaire || viewModalData.rapports[0].noteRapport) && (
                  <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#1e2124', borderRadius: '6px', borderLeft: '4px solid #3498db' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ color: '#3498db', fontSize: '13px', fontWeight: 'bold' }}>Rapport Écrit</span>
                        <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '14px' }}>
                          {viewModalData.rapports[0].noteRapport ? `${viewModalData.rapports[0].noteRapport} / 20` : 'En attente de note'}
                        </span>
                     </div>
                     {viewModalData.rapports[0].commentaire ? (
                        <p style={{ color: '#ddd', fontSize: '13px', margin: '5px 0 0 0', fontStyle: 'italic', lineHeight: '1.5' }}>"{viewModalData.rapports[0].commentaire}"</p>
                     ) : (
                        <p style={{ color: '#777', fontSize: '12px', margin: '5px 0 0 0', fontStyle: 'italic' }}>Aucun commentaire laissé.</p>
                     )}
                  </div>
                )}

                {viewModalData.soutenances && viewModalData.soutenances.length > 0 && (viewModalData.soutenances[0].commentaireSoutenance || viewModalData.soutenances[0].noteSoutenance) && (
                  <div style={{ padding: '15px', backgroundColor: '#1e2124', borderRadius: '6px', borderLeft: '4px solid #e67e22' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ color: '#e67e22', fontSize: '13px', fontWeight: 'bold' }}>Soutenance Orale</span>
                        <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '14px' }}>
                          {viewModalData.soutenances[0].noteSoutenance ? `${viewModalData.soutenances[0].noteSoutenance} / 20` : 'En attente de note'}
                        </span>
                     </div>
                     {viewModalData.soutenances[0].commentaireSoutenance ? (
                        <p style={{ color: '#ddd', fontSize: '13px', margin: '5px 0 0 0', fontStyle: 'italic', lineHeight: '1.5' }}>"{viewModalData.soutenances[0].commentaireSoutenance}"</p>
                     ) : (
                        <p style={{ color: '#777', fontSize: '12px', margin: '5px 0 0 0', fontStyle: 'italic' }}>Aucun commentaire laissé.</p>
                     )}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '25px' }}>
              <button onClick={() => setViewModalData(null)} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE 3 : MODIFIER */}
      {editModalData && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, borderTopColor: '#f39c12' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#fff' }}>Modifier le stage</h2>
            
            <form onSubmit={handleEditSubmit}>
              <label style={labelStyle}>État actuel du stage</label>
              <select style={inputStyle} value={editModalData.etat || ''} onChange={(e) => setEditModalData({...editModalData, etat: e.target.value})}>
                <option value="EN_ATTENTE">En attente (Non commencé)</option>
                <option value="EN_COURS">En cours</option>
                <option value="VALIDE">Validé (Terminé)</option>
              </select>

              <label style={labelStyle}>Sujet du stage</label>
              <input type="text" required style={inputStyle} value={editModalData.sujet || ''} onChange={(e) => setEditModalData({...editModalData, sujet: e.target.value})} />
              
              <label style={labelStyle}>Tuteur Enseignant référent</label>
              <select required style={inputStyle} value={editModalData.tuteurId || editModalData.tuteur?.idEnseignant || ''} onChange={(e) => setEditModalData({...editModalData, tuteurId: e.target.value})}>
                <option value="">Sélectionner un enseignant...</option>
                {profsList.map((p) => (
                  <option key={p.idEnseignant} value={p.idEnseignant}>{p.nomEnseignant} {p.prenomEnseignant}</option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Date de début</label>
                  <input type="date" required style={inputStyle} value={editModalData.dateDebut || ''} onChange={(e) => setEditModalData({...editModalData, dateDebut: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Durée</label>
                  <input type="text" required style={inputStyle} value={editModalData.duree || ''} onChange={(e) => setEditModalData({...editModalData, duree: e.target.value})} />
                </div>
              </div>

              <label style={labelStyle}>Date limite de rendu du rapport</label>
              <input type="date" style={inputStyle} value={editModalData.dateLimiteRapport || ''} onChange={(e) => setEditModalData({...editModalData, dateLimiteRapport: e.target.value})} />

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Date de soutenance</label>
                  <input type="date" value={dateSoutenance} onChange={(e) => setDateSoutenance(e.target.value)} style={{...inputStyle, marginBottom: 0}} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Salle assignée</label>
                  <input type="text" placeholder="Ex: Salle B12" value={salleSoutenance} onChange={(e) => setSalleSoutenance(e.target.value)} style={{...inputStyle, marginBottom: 0}} />
                </div>
              </div>

              <label style={labelStyle}>Objectifs / Description</label>
              <textarea required rows="3" style={{ ...inputStyle, resize: 'none' }} value={editModalData.objectif || ''} onChange={(e) => setEditModalData({...editModalData, objectif: e.target.value})}></textarea>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #444' }}>
                <button type="button" onClick={() => handleDelete(editModalData.idStage || editModalData.id)} style={{ padding: '10px 15px', backgroundColor: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Supprimer</button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setEditModalData(null)} style={{ padding: '10px 15px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Annuler</button>
                  <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Enregistrer</button>
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