import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PatagoniaLogo = "/src/assets/Patagonia.png";
const Logo911 = "/src/assets/911_Logo.jpg";

const Home: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white flex flex-col h-screen">
      <section className="flex-grow relative flex items-center justify-center px-4">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: `url(${Logo911})`,
            backgroundSize: '50%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
      </section>
    </div>
  );
};

export default Home;