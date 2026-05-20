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

  // --- ACTIONS VERS LE BACKEND ---
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
    if (window.confirm("Supprimer cette entreprise ?")) {
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

  // --- STYLES ---
  const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalStyle = { backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px', width: '400px', borderTop: '5px solid #2ecc71', boxShadow: '0 15px 25px rgba(0,0,0,0.5)' };
  const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1e2124', color: '#fff', boxSizing: 'border-box', marginBottom: '15px' };
  const labelStyle = { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '5px' };

  if (loading) {
    return <div style={{ padding: '40px', color: '#fff' }}>Chargement des entreprises...</div>;
  }

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1100px', boxSizing: 'border-box', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>Gestion des Entreprises</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa', fontSize: '16px' }}>Connecté en tant que <b style={{ color: '#ffffff' }}>{user?.email}</b></p>
        </div>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Se déconnecter</button>
      </div>

      {/* TABLEAU */}
      <div style={{ backgroundColor: '#2c2f33', padding: '30px', borderRadius: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444', color: '#aaaaaa' }}>
              <th style={{ padding: '15px 10px' }}>Nom (Raison Sociale)</th>
              <th style={{ padding: '15px 10px' }}>Adresse</th>
              <th style={{ padding: '15px 10px' }}>Contact</th>
              <th style={{ padding: '15px 10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedEntreprises.map((ent) => (
              <tr key={ent.idEntreprise} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '15px 10px', color: '#ffffff' }}>{ent.raisonSociale}</td>
                <td style={{ padding: '15px 10px', color: '#dddddd' }}>{ent.adresse}</td>
                <td style={{ padding: '15px 10px', color: '#3498db' }}>{ent.contact}</td>
                <td style={{ padding: '15px 10px' }}>
                  <button onClick={() => setEditModalData(ent)}>Modifier</button>
                  <button onClick={() => handleDelete(ent.idEntreprise)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Entreprises;