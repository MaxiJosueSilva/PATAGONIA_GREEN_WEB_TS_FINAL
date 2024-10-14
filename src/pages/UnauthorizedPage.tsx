import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Acceso No Autorizado</h1>
      <p className="mb-4">Lo sentimos, no tienes permiso para acceder a esta página.</p>
      <Link to="/" className="text-blue-500 hover:underline">Volver a la página principal</Link>
    </div>
  );
};

export default UnauthorizedPage;