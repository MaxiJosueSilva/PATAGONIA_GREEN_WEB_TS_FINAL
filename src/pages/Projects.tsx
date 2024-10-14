import React, { useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  progress: number;
}

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: 1,
      title: "Restauración del Bosque Andino Patagónico",
      description: "Un proyecto a largo plazo para reforestar áreas degradadas del bosque andino patagónico con especies nativas.",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      progress: 75
    },
    {
      id: 2,
      title: "Protección del Huemul",
      description: "Programa de conservación del huemul, un ciervo en peligro de extinción endémico de la Patagonia.",
      image: "https://images.unsplash.com/photo-1484406566174-9da000fda645?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      progress: 60
    },
    {
      id: 3,
      title: "Limpieza de Costas Patagónicas",
      description: "Iniciativa para limpiar y preservar las costas patagónicas, protegiendo la vida marina y los ecosistemas costeros.",
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      progress: 40
    },
  ];

  const openModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Nuestros Proyectos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
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
            <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-64 object-cover mb-4 rounded" />
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