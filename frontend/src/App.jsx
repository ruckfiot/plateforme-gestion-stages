import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Accueil from './pages/Accueil';
import Stages from './pages/Stages';
import Entreprises from './pages/Entreprises';
import Utilisateurs from './pages/Utilisateurs';
import Evaluations from './pages/Evaluations'; // NOUVEL IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Publique */}
        <Route path="/" element={<Login />} />
        
        {/* Routes Privées */}
        <Route 
          path="/accueil" 
          element={<ProtectedRoute><Accueil /></ProtectedRoute>} 
        />
        
        <Route 
          path="/stages" 
          element={<ProtectedRoute><Stages /></ProtectedRoute>} 
        />

        <Route 
          path="/entreprises" 
          element={<ProtectedRoute><Entreprises /></ProtectedRoute>} 
        />

        <Route 
          path="/utilisateurs" 
          element={<ProtectedRoute><Utilisateurs /></ProtectedRoute>} 
        />

        <Route 
          path="/evaluations" 
          element={<ProtectedRoute><Evaluations /></ProtectedRoute>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;