import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

// !!! SÉCURITÉ ACCÈS : Empêche un utilisateur non connecté de forcer l'URL dans le navigateur (ex: taper /stages)
const ProtectedRoute = ({ children }) => {

  // !!! PERSISTANCE : Récupère l'email, le rôle et le token JWT stockés lors de la connexion
  const user = authService.getCurrentUser();

  // !!! ANTI-RETOUR : "replace" efface l'historique pour empêcher le bouton "Précédent" du navigateur de revenir en arrière
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // !!! DOUBLE SÉCURITÉ : Le Front protège l'affichage visuel, tandis que le Back (Spring) valide le vrai token JWT
  return children;
};

export default ProtectedRoute;