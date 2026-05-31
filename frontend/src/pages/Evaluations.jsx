import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import stageService from '../services/stageService';

const Evaluations = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [searchParams] = useSearchParams();
  
  const stageIdParam = searchParams.get('id');

  const [stages, setStages] = useState([]);
  const [stageSelectionne, setStageSelectionne] = useState(null);
  const [loading, setLoading] = useState(true);

  const [noteRapport, setNoteRapport] = useState('');
  const [commentaireRapport, setCommentaireRapport] = useState(''); 
  const [noteSoutenance, setNoteSoutenance] = useState('');
  const [commentaireSoutenance, setCommentaireSoutenance] = useState(''); 

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchDonnees = async () => {
      setLoading(true);
      try {
        const mesStagesDb = await stageService.getStagesByTuteur();
        setStages(mesStagesDb);

        if (stageIdParam) {
          const stageTrouve = mesStagesDb.find(s => (s.idStage || s.id).toString() === stageIdParam);
          
          if (stageTrouve) {
            setStageSelectionne(stageTrouve);
            
            const rapport = stageTrouve.rapports && stageTrouve.rapports.length > 0 ? stageTrouve.rapports[0] : null;
            const soutenance = stageTrouve.soutenances && stageTrouve.soutenances.length > 0 ? stageTrouve.soutenances[0] : null;

            if (rapport) {
              setNoteRapport(rapport.noteRapport || '');
              setCommentaireRapport(rapport.commentaire || ''); 
            }
            if (soutenance) {
              setNoteSoutenance(soutenance.noteSoutenance || '');
              setCommentaireSoutenance(soutenance.commentaireSoutenance || ''); 
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonnees();
  }, [stageIdParam]);

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

  const handleEnregistrerNotes = async () => {
    try {
      await stageService.evaluerStage(stageIdParam, {
        noteRapport: noteRapport,
        commentaire: commentaireRapport,
        noteSoutenance: noteSoutenance,
        commentaireSoutenance: commentaireSoutenance
      });

      alert("Évaluations enregistrées avec succès !");
      navigate(-1); 
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#fff', textAlign: 'center' }}>Chargement des évaluations...</div>;

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1100px', boxSizing: 'border-box', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>Évaluations</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa', fontSize: '16px' }}>
            Connecté en tant que <b style={{ color: '#ffffff' }}>{user?.email}</b>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/accueil')} style={{ padding: '10px 20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Retour à l'accueil</button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Se déconnecter</button>
        </div>
      </div>

      {stageSelectionne ? (
        <div style={{ backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}>
          <h2 style={{ color: '#ffffff', marginTop: 0 }}>
            Évaluer le stage de : {stageSelectionne.apprenant?.prenomApprenant} {stageSelectionne.apprenant?.nomApprenant}
          </h2>
          <p style={{ color: '#aaaaaa' }}>Sujet : {stageSelectionne.sujet || stageSelectionne.titre}</p>
          
          {stageSelectionne.rapports && stageSelectionne.rapports.length > 0 && (
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#2ecc7115', border: '1px dashed #2ecc71', borderRadius: '5px' }}>
              <span style={{ color: '#2ecc71', fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Document à évaluer :</span>
              
              {/* NOUVEAUTÉ : Bouton cliquable pour ouvrir le PDF au lieu d'un simple lien a href */}
              <span 
                onClick={() => ouvrirPDF(stageSelectionne.rapports[0].nomFichier)} 
                style={{ color: '#fff', textDecoration: 'underline', cursor: 'pointer' }}>
                {stageSelectionne.rapports[0].nomFichier}
              </span>

            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
            
            <div style={{ backgroundColor: '#1e2124', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#3498db', marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '10px' }}>Rapport Écrit</h3>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <label style={{ color: '#aaa', fontSize: '14px', flex: '1' }}>Note attribuée (/20)</label>
                <input 
                  type="number" min="0" max="20" step="0.5" placeholder="ex: 15.5"
                  value={noteRapport}
                  onChange={(e) => setNoteRapport(e.target.value)}
                  style={{ width: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2c2f33', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} 
                />
              </div>
              
              <div>
                <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Commentaire (Rapport)</label>
                <textarea 
                  rows="4" 
                  placeholder="Avis sur le rapport écrit, la structuration, l'analyse..." 
                  value={commentaireRapport} 
                  onChange={(e) => setCommentaireRapport(e.target.value)} 
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#2c2f33', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
                ></textarea>
              </div>
            </div>

            <div style={{ backgroundColor: '#1e2124', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#2ecc71', marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '10px' }}>Soutenance Orale</h3>
              
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <label style={{ color: '#aaa', fontSize: '14px', flex: '1' }}>Note attribuée (/20)</label>
                <input 
                  type="number" min="0" max="20" step="0.5" placeholder="ex: 18"
                  value={noteSoutenance}
                  onChange={(e) => setNoteSoutenance(e.target.value)}
                  style={{ width: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2c2f33', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} 
                />
              </div>
              
              <div>
                <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Commentaire (Soutenance)</label>
                <textarea 
                  rows="4" 
                  placeholder="Avis sur la présentation orale, l'aisance, les réponses aux questions..." 
                  value={commentaireSoutenance} 
                  onChange={(e) => setCommentaireSoutenance(e.target.value)} 
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#2c2f33', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
                ></textarea>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button 
              onClick={handleEnregistrerNotes} 
              style={{ padding: '12px 25px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Enregistrer l'évaluation
            </button>
            <button 
              onClick={() => navigate(-1)}
              style={{ padding: '12px 25px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)' }}>
          <h2 style={{ color: '#ffffff', marginTop: 0, marginBottom: '20px' }}>Stages à évaluer</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #444', color: '#aaaaaa' }}>
                <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Étudiant</th>
                <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Sujet</th>
                <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Note Rapport</th>
                <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Note Soutenance</th>
                <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stages.length > 0 ? stages.map((s) => {
                const id = s.idStage || s.id;
                const nomEleve = s.apprenant ? `${s.apprenant.prenomApprenant} ${s.apprenant.nomApprenant}` : 'Non assigné';
                
                const rapport = s.rapports && s.rapports.length > 0 ? s.rapports[0] : null;
                const soutenance = s.soutenances && s.soutenances.length > 0 ? s.soutenances[0] : null;

                return (
                  <tr key={id} style={{ borderBottom: '1px solid #444' }}>
                    <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 'bold' }}>{nomEleve}</td>
                    <td style={{ padding: '15px 10px', color: '#dddddd' }}>{s.sujet || s.titre}</td>
                    
                    <td style={{ padding: '15px 10px', color: rapport?.noteRapport ? '#2ecc71' : '#e67e22', fontWeight: 'bold' }}>
                      {rapport?.noteRapport ? `${rapport.noteRapport} / 20` : 'À noter'}
                    </td>
                    
                    <td style={{ padding: '15px 10px', color: soutenance?.noteSoutenance ? '#2ecc71' : '#e67e22', fontWeight: 'bold' }}>
                      {soutenance?.noteSoutenance ? `${soutenance.noteSoutenance} / 20` : 'À noter'}
                    </td>
                    
                    <td style={{ padding: '15px 10px' }}>
                      <button onClick={() => navigate(`/evaluations?id=${id}`)} style={{ padding: '8px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Évaluer</button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#aaaaaa' }}>Vous n'avez aucun étudiant à évaluer pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Evaluations;