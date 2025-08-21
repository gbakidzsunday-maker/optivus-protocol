
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { supportedLngs } from '../../i18n';

const languages = Object.entries(supportedLngs).map(([code, name]) => ({ code, name }));

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLanguageCode = i18n.language ? i18n.language.split('-')[0] : 'en';
  const currentLanguageName = supportedLngs[currentLanguageCode as keyof typeof supportedLngs] || 'Language';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-md text-brand-light-gray hover:bg-brand-ui-element/50 hover:text-brand-white focus:outline-none transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Change language, current language is ${currentLanguageName}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3" />
        </svg>
        <span className="font-semibold uppercase text-sm">{currentLanguageCode}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-48 bg-brand-panel border border-brand-ui-element rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <ul className="py-1">
            {languages.map(({ code, name }) => (
              <li key={code}>
                <button
                  onClick={() => changeLanguage(code)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    currentLanguageCode === code
                      ? 'bg-brand-primary text-brand-white'
                      : 'text-brand-light-gray hover:bg-brand-ui-element/50'
                  }`}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};