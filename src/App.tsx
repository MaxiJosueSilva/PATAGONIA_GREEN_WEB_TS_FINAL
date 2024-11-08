import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import InteractiveMap from './components/Map/InteractiveMap';
import About from './pages/About';
import Projects from './pages/Projects';
import News from './pages/News';
import Contact from './pages/Contact';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';
import LoginForm from './components/Auth/LoginForm';
import D3 from './components/D3/D3';
import D3_Arbol from './components/D3_Arbol/D3_Arbol';
import FormOnus from './components/Onus/FormOnus';
import NetworkTopology from './components/NetworkTopology';
import Grupos from './components/Grupos/Grupos';
import FormCamaras from './components/Cameras/FormCamaras';
import UserList from './components/User/UserList';
import Data_Center from './components/Data_Center_911/Data_Center';
import Grupo_Electrogeno from './components/Grupo_Electrogeno/Grupo_Electrogeno';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/map" element={<ProtectedRoute minLevel={5}><InteractiveMap /></ProtectedRoute>} />
          <Route path="/d3" element={<ProtectedRoute minLevel={6}><D3 /></ProtectedRoute>} />
          <Route path="/d3_arbol" element={<ProtectedRoute minLevel={6}><D3_Arbol /></ProtectedRoute>} />
          <Route path="/onus" element={<ProtectedRoute minLevel={5}><FormOnus /></ProtectedRoute>} />
          <Route path="/data-center" element={<ProtectedRoute minLevel={5}><Data_Center /></ProtectedRoute>} />
          <Route path="/network-topology" element={<ProtectedRoute minLevel={5}><NetworkTopology /></ProtectedRoute>} />
          <Route path="/grupos" element={<ProtectedRoute minLevel={5}><Grupos /></ProtectedRoute>} />
          <Route path="/grupo_electrogeno" element={<ProtectedRoute minLevel={5}><Grupo_Electrogeno /></ProtectedRoute>} />
          <Route path="/form-camaras" element={<ProtectedRoute minLevel={5}><FormCamaras /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute minLevel={10}><UserList /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;