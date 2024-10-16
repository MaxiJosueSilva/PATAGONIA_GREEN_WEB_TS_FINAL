import React from 'react';

import MaxiImage from '../assets/Maxi_1.jpg';

const About: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">PATAGONIA GREEN S.A.</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Mi Perfil</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img src={MaxiImage} alt="Maximiliano Silva" className="w-full rounded-lg shadow-md" />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-semibold mb-2">Desarrollador Full Stack</h3>
            <div className="space-y-4">
              <p>
                Soy un desarrollador de aplicaciones web apasionado, con más de 9 años de experiencia creando soluciones digitales de alta calidad. Mi enfoque se basa en combinar creatividad técnica con un profundo entendimiento de las necesidades del cliente para entregar proyectos que superen las expectativas.
              </p>
              <div>
                <h4 className="font-semibold">Mi Experiencia y Habilidades:</h4>
                <ul className="list-disc list-inside">
                  <li><strong>Desarrollo Web:</strong> Python, JavaScript, React.js, Delphi, Node-RED</li>
                  <li><strong>Bases de Datos:</strong> MySQL, MongoDB, Neo4j</li>
                  <li><strong>Diseño Gráfico:</strong> Corel, Inkscape, AutoCAD, SolidWorks</li>
                  <li><strong>Automatización:</strong> Sistemas analógicos, digitales y microcontroladores</li>
                </ul>
              </div>
              <p>
                Me especializo en ofrecer soluciones integrales, desde el desarrollo de software hasta la implementación de sistemas electrónicos. Mi enfoque innovador combina habilidades en desarrollo web con conocimientos en automatización, permitiéndome crear aplicaciones únicas y potentes para Patagonia Green S.A.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
