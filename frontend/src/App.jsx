import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Accueil from './pages/Accueil';
import Stages from './pages/Stages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        
        {/* Privé : Accueil (Le Hub) */}
        <Route 
          path="/accueil" 
          element={
            <ProtectedRoute>
              <Accueil />
            </ProtectedRoute>
          } 
        />
        
        {/* Privé : Liste des stages */}
        <Route 
          path="/stages" 
          element={
            <ProtectedRoute>
              <Stages />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;