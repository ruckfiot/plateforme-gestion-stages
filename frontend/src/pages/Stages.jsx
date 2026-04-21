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

  const allStages = [
    { id: 1, sujet: "Développement d'une API React", entreprise: "TechCorp", tuteur: "M. Lemoine", etudiant: "Jean Dupont", etat: "en_cours", rapport: null, noteRapport: null, noteSoutenance: null },
    { id: 4, sujet: "Mission Découverte", entreprise: "DevSoft", tuteur: "Mme Guerin", etudiant: "Jean Dupont", etat: "valide", rapport: "rapport_final.pdf", noteRapport: 15.5, noteSoutenance: 17 },
    { id: 2, sujet: "Refonte de la base de données", entreprise: "DataSync", tuteur: "Mme Guerin", etudiant: "Sophie Martin", etat: "valide", rapport: "rapport_v1.pdf", noteRapport: 16, noteSoutenance: 14 },
    // J'AI RAJOUTÉ UN FAUX RAPPORT ICI POUR QUE L'ENSEIGNANT (M. Lemoine) PUISSE LE VOIR :
    { id: 3, sujet: "Création d'un Dashboard", entreprise: "WebSolutions", tuteur: "M. Lemoine", etudiant: "Lucas Blanc", etat: "en_attente", rapport: "cahier_charges.pdf", noteRapport: null, noteSoutenance: null },
  ];

  let displayedStages = allStages;
  let titrePage = "Gestion des Stages";

  if (user?.role === 'ENSEIGNANT') {
    titrePage = "Mes Stages Supervisés";
    displayedStages = allStages.filter(stage => stage.tuteur === "M. Lemoine");
  } else if (user?.role === 'APPRENANT') {
    titrePage = "Mes Stages";
    displayedStages = allStages.filter(stage => stage.etudiant === "Jean Dupont");
  }

  const getBadgeStyle = (etat) => {
    switch(etat) {
      case 'valide': return { backgroundColor: '#27ae60', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
      case 'en_cours': return { backgroundColor: '#2980b9', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
      case 'en_attente': return { backgroundColor: '#d35400', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
      default: return { backgroundColor: '#7f8c8d', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
    }
  };

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1100px', boxSizing: 'border-box', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>{titrePage}</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa', fontSize: '16px' }}>
            Connecté en tant que <b style={{ color: '#ffffff' }}>{user?.email}</b> (Rôle: {user?.role})
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/accueil')} style={{ padding: '10px 20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Retour à l'accueil</button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Se déconnecter</button>
        </div>
      </div>

      {user?.role === 'ADMIN' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button style={{ padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>+ Créer un stage</button>
        </div>
      )}

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
              {user?.role === 'APPRENANT' && <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Notes</th>}
              <th style={{ padding: '15px 10px', fontWeight: 'normal' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedStages.map((stage) => (
              <tr key={stage.id} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 'bold' }}>{stage.sujet}</td>
                <td style={{ padding: '15px 10px', color: '#dddddd' }}>{stage.entreprise}</td>
                {user?.role !== 'APPRENANT' && <td style={{ padding: '15px 10px', color: '#dddddd' }}>{stage.etudiant}</td>}
                {user?.role !== 'ENSEIGNANT' && <td style={{ padding: '15px 10px', color: '#dddddd' }}>{stage.tuteur}</td>}
                <td style={{ padding: '15px 10px' }}>
                  <span style={getBadgeStyle(stage.etat)}>
                    {stage.etat.replace('_', ' ').toUpperCase()}
                  </span>
                </td>

                {user?.role === 'APPRENANT' && (
                  <td style={{ padding: '15px 10px', color: '#dddddd', fontSize: '13px' }}>
                    {stage.noteRapport || stage.noteSoutenance ? (
                      <>
                        <div style={{ marginBottom: '4px' }}>Rapport: <b style={{ color: '#2ecc71' }}>{stage.noteRapport}/20</b></div>
                        <div>Soutenance: <b style={{ color: '#2ecc71' }}>{stage.noteSoutenance}/20</b></div>
                      </>
                    ) : (
                      <span style={{ color: '#7f8c8d', fontStyle: 'italic' }}>En attente</span>
                    )}
                  </td>
                )}

                <td style={{ padding: '15px 10px' }}>
                  
                  {user?.role === 'ADMIN' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#3498db', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>Voir</button>
                      <button style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#36393f', color: '#ffffff', border: '1px solid #555', borderRadius: '5px', fontSize: '13px' }}>Modifier</button>
                    </div>
                  )}
                  
                  {user?.role === 'ENSEIGNANT' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        onClick={() => navigate(`/evaluations?id=${stage.id}`)}
                        style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#f39c12', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                        Évaluer
                      </button>
                      {/* LE BOUTON VOIR RAPPORT : Ne s'affiche que si un rapport existe */}
                      {stage.rapport && (
                        <button style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#3498db', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                          Voir rapport
                        </button>
                      )}
                    </div>
                  )}

                  {user?.role === 'APPRENANT' && (
                    stage.rapport ? (
                      <button style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#3498db', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>Voir mon rapport</button>
                    ) : (
                      <button style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#9b59b6', color: '#ffffff', border: 'none', borderRadius: '5px', fontSize: '13px', fontWeight: 'bold' }}>Déposer mon rapport</button>
                    )
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stages;