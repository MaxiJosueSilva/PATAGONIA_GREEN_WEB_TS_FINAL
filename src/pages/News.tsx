import React, { useState } from 'react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

const News: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const articles: Article[] = [
    {
      id: 1,
      title: "Descubrimiento de nueva especie en la Patagonia",
      excerpt: "Científicos han identificado una nueva especie de planta en las montañas de la Patagonia, destacando la importancia de la conservación de la biodiversidad en la región.",
      date: "2024-03-15",
      category: "Biodiversidad",
      image: "https://images.unsplash.com/photo-1530126483408-aa533e55bdb2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "Éxito en la reintroducción del cóndor andino",
      excerpt: "El programa de reintroducción del cóndor andino en la Patagonia muestra resultados prometedores, con un aumento en la población de esta especie emblemática.",
      date: "2024-03-10",
      category: "Conservación",
      image: "https://images.unsplash.com/photo-1557401620-67270b61ea82?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Nuevo acuerdo para proteger los glaciares patagónicos",
      excerpt: "Gobiernos locales y organizaciones ambientales firman un acuerdo histórico para proteger los glaciares de la Patagonia frente al cambio climático.",
      date: "2024-03-05",
      category: "Política Ambiental",
      image: "https://images.unsplash.com/photo-1508108712903-49b7ef9b1df8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
  ];

  const categories = [...new Set(articles.map(article => article.category))];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || article.category === selectedCategory)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Noticias y Blog</h1>
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Buscar artículos..."
          className="border rounded-md px-4 py-2 mb-4 md:mb-0 md:mr-4 w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border rounded-md px-4 py-2 w-full md:w-auto"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{article.date}</span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{article.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <p className="text-center text-gray-600 mt-8">No se encontraron artículos que coincidan con tu búsqueda.</p>
      )}
    </div>
  );
};

export default News;