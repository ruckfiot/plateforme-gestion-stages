import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import entrepriseService from '../services/entrepriseService';
import stageService from '../services/stageService';
import { useNavigate } from 'react-router-dom';
import utilisateurService from '../services/utilisateurService';
import SettingsPanel from '../components/SettingsPanel';

const Accueil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [nbEtudiants, setNbEtudiants] = useState(0);
  const [nbRapports, setNbRapports] = useState(0);
  const [monStage, setMonStage] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // !!! ARCHITECTURE : États locaux centralisant les données analytiques calculées à partir de l'API
  const [adminStats, setAdminStats] = useState({ stages: 0, entreprises: 0, utilisateurs: 0, attente: 0 });
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  // --- SÉLECTEUR DE TEST (n'est plus utilisé) ---
  const switchRole = (newRole) => {
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // REQUÊTES ASYNCHRONES : Chargement conditionnel des données selon le rôle de l'utilisateur extrait du token
  useEffect(() => {
    const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'ADMIN') {
        const entreprisesDb = await entrepriseService.getAllEntreprises();
        const stagesDb = await stageService.getAllStages();
        
        // On va chercher les vrais utilisateurs
        const apprenantsDb = await utilisateurService.getApprenants();
        const profsDb = await utilisateurService.getEnseignants();
        
        // LOGIQUE FILTRAGE : Agrégation dynamique des comptes apprenants et tuteurs bloqués en 'EN_ATTENTE'
        const nbAttente = apprenantsDb.filter(a => a.statut === 'EN_ATTENTE').length + profsDb.filter(p => p.statut === 'EN_ATTENTE').length;;

        setAdminStats({
          stages: stagesDb.length,
          entreprises: entreprisesDb.length,
          utilisateurs: apprenantsDb.length + profsDb.length,
          attente: nbAttente
        });
      }

      else if (user?.role === 'ENSEIGNANT') {
          const mesStages = await stageService.getStagesByTuteur();
          setNbEtudiants(mesStages.length);
          
          // CONDITION STRATEGIQUE : Filtre les livrables déposés par l'étudiant qui n'ont pas encore reçu de note finale
          // COMPTEUR STRICT : Uniquement s'il y a un document physique ET qu'il manque une note
          const rapportsEnAttente = mesStages.filter(stage => {
            const aUnRapport = stage.rapports && stage.rapports.length > 0;
            const aUneSoutenance = stage.soutenances && stage.soutenances.length > 0;
            
            const noteRapport = aUnRapport ? stage.rapports[0].noteRapport : null;
            const noteSoutenance = aUneSoutenance ? stage.soutenances[0].noteSoutenance : null;
            
            // La condition absolue : Un document est là, mais il manque la note du rapport ou de la soutenance
            return aUnRapport && (!noteRapport || !noteSoutenance);
          });
          
          setNbRapports(rapportsEnAttente.length);
      }

      else if (user?.role === 'APPRENANT') {
          // Le token permet au backend de deviner quel élève fait la demande
          const mesStages = await stageService.getStagesByApprenant();
          
          // Si le backend renvoie au moins un stage, on sauvegarde le premier
          if (mesStages && mesStages.length > 0) {
            setMonStage(mesStages[0]);
          } else {
            // Optionnel : s'il n'a pas encore de stage, on s'assure que c'est vide
            setMonStage(null); 
          }
      }
      
    } catch (error) {
      console.error("Erreur de connexion au backend pour l'accueil", error);
    } finally {
      setLoading(false);
    }
  };

    fetchDashboardData();
  }, [user?.role]); // Se déclenche quand le composant charge ou que le rôle change

// !!! PARSING DE DATE : Découpage des chaînes ISO (LocalDateTime) pour un affichage propre au format français JJ/MM/AAAA
const getMessageActualite = () => {
    // Si l'élève n'a pas de stage, on affiche un message de base
    if (!monStage) {
      return <li>Bienvenue sur votre espace. Vous n'avez pas de stage actif.</li>;
    }

    const messages = [];
    const etat = (monStage.etat || '').toUpperCase();

    // Message de statut basique
    if (etat === 'EN_ATTENTE') {
      messages.push("Votre stage est en attente de validation.");
    } else if (etat === 'EN_COURS') {
      messages.push("Votre stage est en cours. Pensez à rédiger votre rapport.");
    } else if (etat === 'RAPPORT_DEPOSE') {
      messages.push("Votre rapport a bien été transmis. En attente d'évaluation.");
    } else if (etat === 'VALIDE' || etat === 'VALIDÉ') {
      messages.push("Félicitations, votre stage est entièrement validé !");
    }

    // Date limite du rapport
    const dateLimite = monStage.dateLimiteRapport;
    if (dateLimite) {
      const datePropre = dateLimite.split('T')[0].split('-').reverse().join('/');
      
      // On met en bleu pour différencier de la soutenance qui est en orange
      messages.push(
        <span style={{ color: '#3498db', fontWeight: 'bold' }}>
          Rapport attendu au plus tard le {datePropre}.
        </span>
      );
    }

    // Affichage dynamique de la soutenance (Date et Salle)
    const laSoutenance = monStage.soutenances && monStage.soutenances.length > 0 ? monStage.soutenances[0] : null;
    const dateSoutenance = laSoutenance?.dateSoutenance || monStage.dateSoutenance;
    const salle = laSoutenance?.salle;

    if (dateSoutenance || salle) {
      let msgSoutenance = "Soutenance programmée ";
      
      if (dateSoutenance) {
        // Découpe la date pour un affichage "français" propre (ex: 2027-03-03 -> 03/03/2027)
        const datePropre = dateSoutenance.split('T')[0].split('-').reverse().join('/'); 
        msgSoutenance += `le ${datePropre} `;
      }
      
      if (salle) {
        msgSoutenance += `en salle ${salle}`;
      }
      
      messages.push(msgSoutenance + ".");
    }

    // Rendu de la liste
    return messages.map((msg, index) => (
      <li key={index} style={{ marginBottom: '10px' }}>
        {/* On vérifie que c'est bien du texte avant d'utiliser includes() */}
        {typeof msg === 'string' && msg.includes("Soutenance programmée") ? (
          <span style={{ color: '#f39c12', fontWeight: 'bold' }}>{msg}</span>
        ) : (
          msg
        )}
      </li>
    ));
  };

  // --- STYLES RÉUTILISABLES ---
  const sectionTitleStyle = { color: '#fff', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: '0' };
  const actionButtonStyle = { backgroundColor: '#34495e', width: '280px', padding: '20px', borderRadius: '10px', boxShadow: '0 8px 15px rgba(0,0,0,0.2)', cursor: 'pointer', transition: '0.2s', textAlign: 'center' };

  // --- RENDU : APPRENANT ---
  const renderApprenantDashboard = () => {
    // On extrait les notes s'il y a un stage et si les évaluations existent
    const rapport = monStage?.rapports && monStage.rapports.length > 0 ? monStage.rapports[0] : null;
    const soutenance = monStage?.soutenances && monStage.soutenances.length > 0 ? monStage.soutenances[0] : null;

    const noteRapport = rapport?.noteRapport;
    const noteSoutenance = soutenance?.noteSoutenance;

    return (
      <div>
        <h2 style={sectionTitleStyle}>Mon Aperçu</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', width: '100%', marginBottom: '40px' }}>
          
          {/* CARTE STAGE APPRENANT (Branchée au backend) */}
          <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #3498db' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Mon Stage Actuel</h3>
            
            {monStage ? (
              <>
                <p style={{ color: '#aaa', margin: '5px 0', fontSize: '14px' }}>Entreprise : <b style={{ color: '#fff' }}>{monStage.entreprise?.raisonSociale}</b></p>
                <p style={{ color: '#aaa', margin: '5px 0', fontSize: '14px' }}>Sujet : <b style={{ color: '#fff' }}>{monStage.titre || monStage.sujet}</b></p>
                <p style={{ color: '#aaa', margin: '5px 0', fontSize: '14px' }}>Tuteur : <b style={{ color: '#fff' }}>{monStage.tuteur ? `${monStage.tuteur.prenomEnseignant} ${monStage.tuteur.nomEnseignant}` : 'Non assigné'}</b></p>
                <div style={{ marginTop: '15px', padding: '8px', backgroundColor: 'rgba(41, 128, 185, 0.2)', color: '#3498db', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>
                  STATUT : {monStage.etat}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <p style={{ color: '#aaa', fontSize: '14px' }}>Vous n'avez pas encore de stage enregistré ou validé.</p>
                <button onClick={() => navigate('/stages')} style={{ marginTop: '10px', backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}>Trouver un stage</button>
              </div>
            )}
          </div>

          {/* CARTE ÉVALUATIONS DYNAMIQUE */}
          <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #2ecc71' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Mes Évaluations</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #444' }}>
              <span style={{ color: '#aaa', fontSize: '14px' }}>Rapport écrit</span>
              {noteRapport ? (
                <b style={{ color: '#2ecc71', fontSize: '16px' }}>{noteRapport} / 20</b>
              ) : (
                <b style={{ color: '#f1c40f' }}>En attente</b>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa', fontSize: '14px' }}>Soutenance orale</span>
              {noteSoutenance ? (
                <b style={{ color: '#2ecc71', fontSize: '16px' }}>{noteSoutenance} / 20</b>
              ) : (
                <b style={{ color: '#f1c40f' }}>En attente</b>
              )}
            </div>
          </div>

          {/* CARTE ACTUALITÉS */}
          <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #f39c12' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Actualités</h3>
            <ul style={{ paddingLeft: '20px', margin: 0, color: '#dddddd', fontSize: '14px', lineHeight: '1.6' }}>
              {getMessageActualite()}
            </ul>
          </div>
        </div>

        <h2 style={sectionTitleStyle}>Accès Rapide</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div onClick={() => navigate('/stages')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Mon Espace Stage</h3>
            <p style={{ color: '#ccc', fontSize: '13px', marginTop: '10px' }}>Déposer mon rapport ou consulter les détails</p>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDU : ENSEIGNANT ---
  const renderEnseignantDashboard = () => (
    <div>
      <h2 style={sectionTitleStyle}>Aperçu du Suivi</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', width: '100%', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #9b59b6' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Mon Suivi</h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}>Vous encadrez actuellement <b style={{ color: '#fff', fontSize: '18px' }}>{nbEtudiants}</b> étudiants.</p>
        </div>

        <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #e74c3c' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>À faire</h3>
          <p style={{ color: '#aaa', fontSize: '14px' }}><b style={{ color: '#e74c3c', fontSize: '18px' }}>{nbRapports}</b> rapports attendent votre évaluation.</p>
        </div>
      </div>

      <h2 style={sectionTitleStyle}>Accès Rapide</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <div onClick={() => navigate('/stages')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Mes Stages Supervisés</h3>
          <p style={{ color: '#aaa', fontSize: '13px', marginTop: '8px' }}>Mettre à jour les statuts</p>
        </div>
        <div onClick={() => navigate('/evaluations')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Espace Évaluations</h3>
          <p style={{ color: '#aaa', fontSize: '13px', marginTop: '8px' }}>Noter les étudiants</p>
        </div>
      </div>
    </div>
  );

  // --- RENDU : ADMIN ---
  // DIVISION DES VUES : Rendu conditionnel restrictif garantissant le cloisonnement des interfaces selon le privilège
  const renderAdminDashboard = () => {
    return (
      <div>
        <h2 style={sectionTitleStyle}>Vue d'ensemble Globale</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', width: '100%', marginBottom: '40px' }}>
          
          {/* CHIFFRES CLÉS (Branchés au backend) */}
          <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #3498db' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Chiffres Clés</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
              <span>Stages enregistrés :</span> 
              <b style={{ color: '#fff' }}>{loading ? '...' : adminStats.stages}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
              <span>Entreprises partenaires :</span> 
              <b style={{ color: '#fff' }}>{loading ? '...' : adminStats.entreprises}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '14px' }}>
              <span>Utilisateurs :</span> 
              <b style={{ color: '#fff' }}>{loading ? '...' : adminStats.utilisateurs}</b>
            </div>
          </div>

          {/* ALERTES (Branchées au backend) */}
          <div style={{ backgroundColor: '#2c2f33', padding: '25px', borderRadius: '10px', borderTop: '4px solid #e67e22' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '18px' }}>Alertes Administratives</h3>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.4' }}>
              <b style={{ color: '#e67e22', fontSize: '18px' }}>{adminStats.attente}</b> demandes d'inscription sont en attente de validation.
            </p>
            <button 
              onClick={() => navigate('/utilisateurs')}
              style={{ marginTop: '10px', backgroundColor: 'transparent', border: '1px solid #e67e22', color: '#e67e22', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              Voir les demandes
            </button>
          </div>
        </div>

        <h2 style={sectionTitleStyle}> Gestion & Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div onClick={() => navigate('/stages')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Gérer les Stages</h3>
          </div>
          <div onClick={() => navigate('/entreprises')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Gérer les Entreprises</h3>
          </div>
          <div onClick={() => navigate('/utilisateurs')} style={actionButtonStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e5871'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#34495e'}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Gestion des Comptes</h3>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '40px', width: '100%', maxWidth: '1100px', boxSizing: 'border-box', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #444', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '32px' }}>Tableau de bord</h1>
          <p style={{ margin: '8px 0 0 0', color: '#aaaaaa' }}>Bienvenue, <b style={{ color: '#fff' }}>{user?.email}</b></p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            style={{ padding: '10px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Paramètres"
          >
            ⚙️
          </button>
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Se déconnecter
          </button>
        </div>
      </div>

      {/* AFFICHAGE CONDITIONNEL SELON LE RÔLE */}
      {user?.role === 'APPRENANT' && renderApprenantDashboard()}
      {user?.role === 'ENSEIGNANT' && renderEnseignantDashboard()}
      {user?.role === 'ADMIN' && renderAdminDashboard()}

    </div>
  );
};

export default Accueil;