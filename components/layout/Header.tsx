
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMobileNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };
  
  const closeAndLogout = () => {
      logout();
      setIsMobileMenuOpen(false);
  }

  const handleLoginClick = () => {
      navigate('/login');
      setIsMobileMenuOpen(false);
  }
  
  const handleSignUpClick = () => {
      navigate('/signup');
      setIsMobileMenuOpen(false);
  }

  return (
    <header className="bg-brand-dark/90 backdrop-blur-md sticky top-0 z-40 border-b border-brand-ui-element/20">
      <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-brand-light-gray hover:text-brand-white transition-colors">{t('header.home')}</Link>
            <Link to="/about" className="text-brand-light-gray hover:text-brand-white transition-colors">{t('header.whitepaper')}</Link>
            <Link to="/contact" className="text-brand-light-gray hover:text-brand-white transition-colors">{t('header.contact')}</Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <span className="hidden lg:block text-brand-light-gray">{t('header.welcome', { name: user?.username })}</span>
              <Button onClick={() => navigate('/dashboard')} variant="secondary" size="sm">{t('header.dashboard')}</Button>
              <Button onClick={closeAndLogout} variant="outline" size="sm">{t('header.logout')}</Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} variant="secondary">{t('header.login')}</Button>
              <Button onClick={() => navigate('/signup')}>{t('header.signup')}</Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Open menu" className="p-2 rounded-md text-brand-light-gray hover:text-brand-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-brand-light-gray hover:text-brand-white hover:bg-brand-ui-element/50">{t('header.home')}</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-brand-light-gray hover:text-brand-white hover:bg-brand-ui-element/50">{t('header.whitepaper')}</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-brand-light-gray hover:text-brand-white hover:bg-brand-ui-element/50">{t('header.contact')}</Link>
        </div>
        <div className="pt-4 pb-3 border-t border-brand-ui-element/20">
          <div className="px-5 mb-3">
            <LanguageSwitcher />
          </div>
          {isAuthenticated ? (
            <div className="px-2 space-y-3">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-full flex items-center justify-center font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="ms-3">
                  <div className="text-base font-medium leading-none text-white">{user?.username}</div>
                  <div className="text-sm font-medium leading-none text-brand-light-gray">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-2">
                <Button onClick={() => handleMobileNav('/dashboard')} variant="secondary" className="w-full justify-start">{t('header.dashboard')}</Button>
                <Button onClick={closeAndLogout} variant="outline" className="w-full justify-start">{t('header.logout')}</Button>
              </div>
            </div>
          ) : (
            <div className="px-2 space-y-2">
              <Button onClick={handleLoginClick} variant="secondary" className="w-full">{t('header.login')}</Button>
              <Button onClick={handleSignUpClick} className="w-full">{t('header.signup')}</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
