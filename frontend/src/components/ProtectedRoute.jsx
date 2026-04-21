import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const user = authService.getCurrentUser();

  // Si pas d'utilisateur dans le localStorage, redirection vers "/"
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Sinon, on affiche la page demandée
  return children;
};

export default ProtectedRoute;