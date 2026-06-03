import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import api from '../services/api';

const ROLE_LABELS = {
  ADMIN:      'Administrateur',
  ENSEIGNANT: 'Enseignant',
  APPRENANT:  'Apprenant',
};

// ERGONOMIE : Composant "Slide-over" (volet latéral) évitant une rupture ou un rechargement de la page courante
export default function SettingsPanel({ isOpen, onClose }) {
  const [ancienMdp,       setAncienMdp]       = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message,         setMessage]         = useState(null);
  const [loading,         setLoading]         = useState(false);

  const navigate = useNavigate();
  const panelRef = useRef(null);  // DOM REF : Référence au nœud HTML pour intercepter la zone de clic
  const user     = authService.getCurrentUser();

  // CLIC EXTÉRIEUR : Ferme le volet si l'événement se produit en dehors de la zone ciblée par panelRef
  useEffect(() => {
    const handleClick = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);  // NETTOYAGE : Évite les fuites de mémoire à la destruction du composant
  }, [isOpen, onClose]);

  // TOUCHE ÉCHAP : Amélioration UX classique permettant la fermeture rapide via le clavier
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleLogout = () => {
    authService.logout();
    onClose();
    navigate('/');
  };

  // VALIDATION CLIENT : Vérifications locales (longueur, correspondance) réduisant la charge de requêtes sur l'API
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères.' });
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      setLoading(false);
      return;
    }

    // APPEL API SÉCURISÉ : Transmission des paramètres à la route backend dédiée au chiffrement BCrypt
    try {
      await api.put('/auth/change-password', {
        email: user.email,
        ancienMotDePasse: ancienMdp,
        nouveauMotDePasse: newPassword
      });
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
      setAncienMdp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMsg = error.response?.data || 'Erreur lors de la mise à jour.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 999 }} />
      <div ref={panelRef} style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: '400px', maxWidth: '80%', backgroundColor: '#2c2f33', zIndex: 1000, boxShadow: '-5px 0 20px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #444' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Paramètres</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '24px', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <h3 style={{ color: '#3498db', fontSize: '16px', marginTop: 0 }}>Mon Profil</h3>
          <div style={{ backgroundColor: '#1e2124', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#aaa' }}>Email : <span style={{ color: '#fff', fontWeight: 'bold' }}>{user?.email}</span></p>
            <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>Rôle : <span style={{ color: '#fff', fontWeight: 'bold' }}>{ROLE_LABELS[user?.role] || user?.role}</span></p>
          </div>
          <h3 style={{ color: '#2ecc71', fontSize: '16px', marginTop: 0 }}>Sécurité</h3>
          <form onSubmit={handleUpdatePassword} style={{ backgroundColor: '#1e2124', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Mot de passe actuel</label>
              <input type="password" required value={ancienMdp} onChange={e => setAncienMdp(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2c2f33', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Nouveau mot de passe</label>
              <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2c2f33', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Confirmer le nouveau mot de passe</label>
              <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#2c2f33', color: '#fff', boxSizing: 'border-box' }} />
            </div>
            {message && (
              <div style={{ padding: '10px', borderRadius: '5px', fontSize: '13px', backgroundColor: message.type === 'success' ? '#2ecc7120' : '#e74c3c20', color: message.type === 'success' ? '#2ecc71' : '#e74c3c', border: `1px solid ${message.type === 'success' ? '#2ecc71' : '#e74c3c'}` }}>
                {message.type === 'success' ? '✓ ' : '✕ '}{message.text}
              </div>
            )}
            <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: loading ? '#2980b9' : '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </form>
        </div>
        <div style={{ padding: '16px 20px', flexShrink: 0 }}>
          <button onClick={handleLogout} style={{ width: '100%', padding: '11px', borderRadius: '6px', backgroundColor: '#e74c3c', border: 'none', color: '#fff', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  );
}