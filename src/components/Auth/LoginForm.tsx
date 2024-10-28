import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated, decodeToken } from '../../services/authService';
import './LoginForm.css';
import PatagoniaLogo from '../../assets/Patagonia.png'

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [alreadyAuthenticated, setAlreadyAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      setAlreadyAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadyAuthenticated) {
      setError('El usuario ya está autenticado.');
      return;
    }
    try {
      const token = await login(username, password);
      if (token) {
        const decodedToken = decodeToken();
        if (decodedToken && decodedToken.level) {
          navigate('/');
          window.location.reload();
        } else {
          setError('Error al decodificar el token');
        }
      } else {
        setError('Usuario o contraseña inválidos');
      }
    } catch (err) {
      setError('Usuario o contraseña inválidos');
      console.error('Error de inicio de sesión:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={PatagoniaLogo} alt="Logo" className="login-logo" />
        <h2>PATAGONIA GREEN S.A.</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              style={{ backgroundColor: '#1a202c', color: 'white' }}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              style={{ backgroundColor: '#1a202c', color: 'white' }}
              required
            />
          </div>
          <button type="submit" className="Send" disabled={alreadyAuthenticated} style={{ backgroundColor: '#0000ff' }}>
            Iniciar Sesión
          </button>
        </form>
        {alreadyAuthenticated && (
          <p className="already-authenticated-message">Ya estás autenticado.</p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;