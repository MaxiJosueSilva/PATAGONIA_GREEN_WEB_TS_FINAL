import React, { createContext, useState } from 'react';

interface NavegadorContextType {
  camaraSeleccionada: string | null;
  setCamaraSeleccionada: React.Dispatch<React.SetStateAction<string | null>>;
  camaraip: string | null;
  setCamaraip: React.Dispatch<React.SetStateAction<string | null>>;
}

export const NavegadorContext = createContext<NavegadorContextType>({
  camaraSeleccionada: null,
  setCamaraSeleccionada: () => {},
  camaraip: null,
  setCamaraip: () => {},
});

export const NavegadorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [camaraSeleccionada, setCamaraSeleccionada] = useState<string | null>(null);
  const [camaraip, setCamaraip] = useState<string | null>(null);

  return (
    <NavegadorContext.Provider value={{ camaraSeleccionada, setCamaraSeleccionada, camaraip, setCamaraip }}>
      {children}
    </NavegadorContext.Provider>
  );
};