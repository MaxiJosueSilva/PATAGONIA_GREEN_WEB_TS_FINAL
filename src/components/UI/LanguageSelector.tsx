import React, { useState } from 'react';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 bg-green-600 px-3 py-1 rounded-md hover:bg-green-500 transition-colors"
    >
      <Globe size={18} />
      <span>{language === 'en' ? 'EN' : 'ES'}</span>
    </button>
  );
};

export default LanguageSelector;