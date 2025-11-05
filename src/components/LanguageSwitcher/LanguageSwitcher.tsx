import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const languages = [
  { code: 'en', name: 'EN' },
  { code: 'ru', name: 'RU' },
  { code: 'de', name: 'DE' },
  { code: 'uk', name: 'UA' },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18nextLng', langCode);
    setIsOpen(false);
  };

  // Close on click outside component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        type="button"
        className="language-select-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        {currentLanguage.name}
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`language-option ${i18n.language === lang.code ? 'selected' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              role="option"
              aria-selected={i18n.language === lang.code}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;

