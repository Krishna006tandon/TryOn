import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang, i18n]);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'hi' : 'en';
    setCurrentLang(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors"
      aria-label="Toggle Language"
    >
      {currentLang === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
};

// Translation hook for components
export const useTranslate = () => {
  const [loading, setLoading] = useState(false);

  const translate = async (text, targetLang = 'hi') => {
    if (!text) return text;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/translate/text`, {
        text,
        targetLanguage: targetLang,
      });
      return response.data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setLoading(false);
    }
  };

  return { translate, loading };
};

export default LanguageSwitcher;

