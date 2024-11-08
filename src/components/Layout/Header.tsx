import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, ChevronDown, Map, Menu, X, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
const PatagoniaLogo = "/src/assets/Patagonia.png";
//const PatagoniaLogo = "/usr/share/nginx/html/src/assets/Patagonia.png"; // Cambiado para reflejar la ruta correcta en el contenedor Docker


const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNetworksOpen, setIsNetworksOpen] = useState(false);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, userLevel } = useAuth();
  const networksRef = useRef<HTMLLIElement>(null);
  const managementRef = useRef<HTMLLIElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userLevel');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (networksRef.current && !networksRef.current.contains(event.target as Node)) {
        setIsNetworksOpen(false);
      }
      if (managementRef.current && !managementRef.current.contains(event.target as Node)) {
        setIsManagementOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsNetworksOpen(false);
    setIsManagementOpen(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md" style={{ position: 'relative', zIndex: 1001 }}>
      
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src={PatagoniaLogo} alt="Patagonia Green" className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold text-blue-300">Patagonia Green S.A.</span>
        </Link>
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-16 left-0 right-0 md:top-0 bg-gray-900 md:bg-transparent z-40`}>
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 p-4 md:p-0">
            <li><Link to="/" className="hover:text-blue-300 transition-colors">Inicio</Link></li>
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/map" className="hover:text-blue-300 transition-colors flex items-center">
                    <Map size={18} className="mr-1" />
                    Mapa
                  </Link>
                </li>
                <li ref={networksRef} className="relative">
                  <button 
                    onClick={() => setIsNetworksOpen(!isNetworksOpen)}
                    className="flex items-center hover:text-blue-300 transition-colors"
                  >
                    Redes <ChevronDown size={20} />
                  </button>
                  {isNetworksOpen && (
                    <ul className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <li><Link to="/d3" className="block px-4 py-2 text-sm hover:bg-gray-700">CONEXION</Link></li>
                      <li><Link to="/d3_arbol" className="block px-4 py-2 text-sm hover:bg-gray-700">ARBOL</Link></li>
                      <li><Link to="/onus" className="block px-4 py-2 text-sm hover:bg-gray-700">ONUs</Link></li>
                      <li><Link to="/network-topology" className="block px-4 py-2 text-sm hover:bg-gray-700">Topología</Link></li>
                      <li><Link to="/data-center" className="block px-4 py-2 text-sm hover:bg-gray-700">Data Center 911</Link></li>
                      {/* <li><Link to="/grupos" className="block px-4 py-2 text-sm hover:bg-gray-700">Grupos</Link></li> */}
                      <li><Link to="/grupo_electrogeno" className="block px-4 py-2 text-sm hover:bg-gray-700">Grupos</Link></li>
                    </ul>
                  )}
                </li>
                <li ref={managementRef} className="relative">
                  <button 
                    onClick={() => setIsManagementOpen(!isManagementOpen)}
                    className="flex items-center hover:text-blue-300 transition-colors"
                  >
                    Gestión <ChevronDown size={20} />
                  </button>
                  {isManagementOpen && (
                    <ul className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <li><Link to="/form-camaras" className="block px-4 py-2 text-sm hover:bg-gray-700">Formulario de Cámaras</Link></li>
                      {userLevel >= 10 && (
                        <li>
                          <Link to="/users" className="block px-4 py-2 text-sm hover:bg-gray-700 flex items-center">
                            <Users size={16} className="mr-2" />
                            Gestión de Usuarios
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
                <li><button onClick={handleLogout} className="hover:text-blue-300 transition-colors">Cerrar sesión</button></li>
              </>
            )}
            
            {!isAuthenticated && (
              <li><Link to="/login" className="hover:text-blue-300 transition-colors">Iniciar sesión</Link></li>
            )}
            <li><Link to="/projects" className="hover:text-blue-300 transition-colors">Proyectos</Link></li>
            {/* <li><Link to="/news" className="hover:text-blue-300 transition-colors">Noticias</Link></li> */}
            <li><Link to="/contact" className="hover:text-blue-300 transition-colors">Contacto</Link></li>
            <li><Link to="/about" className="hover:text-blue-300 transition-colors">Acerca de</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;