import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

const Evaluations = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [searchParams] = useSearchParams();
  
  const stageIdParam = searchParams.get('id');

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const mesStages = [
    { id: 1, etudiant: "Jean Dupont", sujet: "API React", noteRapport: null, noteSoutenance: null, com: "" },
    { id: 3, etudiant: "Lucas Blanc", sujet: "Dashboard", noteRapport: 14.5, noteSoutenance: null, com: "Bon début" },
  ];

  const stageSelectionne = stageIdParam 
    ? mesStages.find(s => s.id === parseInt(stageIdParam)) 
    : null;

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1100px', boxSizing: 'border-box', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      {/* HEADER */}
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
          <h2 style={{ color: '#ffffff', marginTop: 0 }}>Noter le stage de : {stageSelectionne.etudiant}</h2>
          <p style={{ color: '#aaaaaa' }}>Sujet : {stageSelectionne.sujet}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
            <div style={{ backgroundColor: '#1e2124', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#3498db', marginTop: 0 }}>Rapport</h3>
              <label style={{ color: '#fff', display: 'block', marginBottom: '10px', fontSize: '14px' }}>Note / 20</label>
              <input 
                type="number" min="0" max="20" step="0.5" placeholder="ex: 15.5"
                defaultValue={stageSelectionne.noteRapport || ''}
                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2c2f33', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ backgroundColor: '#1e2124', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ color: '#2ecc71', marginTop: 0 }}>Soutenance</h3>
              <label style={{ color: '#fff', display: 'block', marginBottom: '10px', fontSize: '14px' }}>Note / 20</label>
              <input 
                type="number" min="0" max="20" step="0.5" placeholder="ex: 18"
                defaultValue={stageSelectionne.noteSoutenance || ''}
                style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#2c2f33', color: '#fff', fontSize: '16px', boxSizing: 'border-box' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            <button 
              onClick={() => navigate(-1)} // Retourne aussi en arrière après enregistrement (temporaire le temps du backend)
              style={{ padding: '12px 25px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Enregistrer les notes
            </button>
            <button 
              onClick={() => navigate(-1)} // 🚀 LE FAMEUX RETOUR HISTORIQUE
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
              {mesStages.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 'bold' }}>{s.etudiant}</td>
                  <td style={{ padding: '15px 10px', color: '#dddddd' }}>{s.sujet}</td>
                  <td style={{ padding: '15px 10px', color: s.noteRapport ? '#2ecc71' : '#e67e22', fontWeight: 'bold' }}>{s.noteRapport ? `${s.noteRapport} / 20` : 'À noter'}</td>
                  <td style={{ padding: '15px 10px', color: s.noteSoutenance ? '#2ecc71' : '#e67e22', fontWeight: 'bold' }}>{s.noteSoutenance ? `${s.noteSoutenance} / 20` : 'À noter'}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <button onClick={() => navigate(`/evaluations?id=${s.id}`)} style={{ padding: '8px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Évaluer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Evaluations;