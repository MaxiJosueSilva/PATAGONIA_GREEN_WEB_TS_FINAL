import React from 'react';

import MaxiImage from '../assets/Maxi_1.jpg';

const About: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Sobre Patagonia Green Conservation</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Nuestro Equipo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img src={MaxiImage} alt="Maximiliano Silva" className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
            <h3 className="text-xl font-semibold text-center">Maximiliano Silva</h3>
            <p className="text-center text-gray-600">Full Stack Developer</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Perfil de Maximiliano Silva</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img src={MaxiImage} alt="Maximiliano Silva" className="w-full rounded-lg shadow-md" />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold mb-2">Full Stack Developer</h3>
            <div className="space-y-4">
              <p>
                Como desarrollador de aplicaciones web apasionado y versátil, Maximiliano cuenta con más de 6 años de experiencia en la creación de soluciones digitales de alta calidad. Su enfoque se centra en combinar creatividad técnica con un profundo entendimiento de las necesidades del cliente para entregar proyectos excepcionales.
              </p>
              <div>
                <h4 className="font-semibold">Experiencia y Habilidades:</h4>
                <ul className="list-disc list-inside">
                  <li><strong>Desarrollo Web:</strong> Python, JavaScript, React.js, Delphi, Node-RED</li>
                  <li><strong>Bases de Datos:</strong> MySQL, MongoDB, Neo4j</li>
                  <li><strong>Diseño Gráfico:</strong> Corel, Inkscape, AutoCAD, SolidWorks</li>
                  <li><strong>Automatización:</strong> Sistemas analógicos, digitales y microcontroladores</li>
                </ul>
              </div>
              <p>
                Maximiliano se destaca por ofrecer soluciones integrales, desde el desarrollo de software hasta la implementación electrónica. Su enfoque innovador combina habilidades en desarrollo web con conocimientos en automatización, permitiéndole crear aplicaciones únicas y potentes para Patagonia Green Conservation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;