import React, { useState, useEffect } from 'react';

const Logo1 = "/src/assets/img_proyectos/1.jpg";
const Logo2 = "/src/assets/img_proyectos/2.jpg";
const Logo3 = "/src/assets/img_proyectos/3.jpg";
const Logo4 = "/src/assets/img_proyectos/4.jpg";
const Logo5 = "/src/assets/img_proyectos/5.jpg";
const Logo6 = "/src/assets/img_proyectos/6.jpg";
const Logo7 = "/src/assets/img_proyectos/7.jpg";
const Logo8 = "/src/assets/img_proyectos/8.jpg";
const Logo9 = "/src/assets/img_proyectos/9.jpg";

interface Project {
  id: number;
  title: string;
  description: string;
  images: string[];
  progress: number;
}

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  
  const projects: Project[] = [
    {
      id: 1,
      title: "Instalación de 400 Camara de Video 911 Paraná",
      description: "Proyecto para mejorar la vigilancia y seguridad mediante la instalación de 400 cámaras de video en la ciudad de Paraná.",
      images: [Logo1],
      progress: 100
    },
    {
      id: 2,
      title: "Placa Control Remota",
      description: "Dispositivo para monitoreo y control remoto de los grupos electrógenos (SBS).",
      images: [Logo2, Logo3, Logo4, Logo5],
      progress: 100
    },
    {
      id: 3,
      title: "Instalación de Fibra Optica Red GPON",
      description: "Proyecto para la instalación de más de 170.000 metros de fibra óptica, mejorando la conectividad y velocidad de la red GPON.",
      images: [Logo6, Logo7, Logo8, Logo9],
      progress: 100
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (selectedProject && selectedProject.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImage((prevImage) => 
          (prevImage + 1) % selectedProject.images.length
        );
      }, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedProject]);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImage(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setCurrentImage(0);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Nuestros Proyectos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={project.images[0]} alt={project.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description.substring(0, 100)}...</p>
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 rounded-full h-2"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Progreso: {project.progress}%</p>
              </div>
              <button
                onClick={() => openModal(project)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Más Información
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-90vh overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{selectedProject.title}</h2>
            <div className="relative h-64 mb-4">
              {selectedProject.images.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${selectedProject.title} - Image ${index + 1}`} 
                  className={`absolute w-full h-full object-cover rounded transition-opacity duration-500 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
            </div>
            <p className="text-gray-700 mb-4">{selectedProject.description}</p>
            <div className="mb-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 rounded-full h-2"
                  style={{ width: `${selectedProject.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">Progreso: {selectedProject.progress}%</p>
            </div>
            <button
              onClick={closeModal}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;