import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HomePage } from '../pages/public/HomePage';
import { LoginPage } from '../pages/public/LoginPage';
import { SignupPage } from '../pages/public/SignupPage';
import { AboutPage } from '../pages/public/AboutPage';
import { TermsPage } from '../pages/public/TermsPage';
import { PrivacyPage } from '../pages/public/PrivacyPage';
import { ResetPasswordPage } from '../pages/public/ResetPasswordPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { TestingModeBanner } from '../components/ui/TestingModeBanner';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { ContactPage } from '../pages/public/ContactPage';
import { FaqPage } from '../pages/public/FaqPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminPage } from '../pages/admin/AdminPage';

const rtlLanguages = ['ar'];

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password', '/admin-login'].includes(location.pathname);


  if (isDashboard || isHomePage || isAdminPage || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};


function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language) {
      const currentLang = i18n.language.split('-')[0];
      document.documentElement.lang = currentLang;
      document.documentElement.dir = rtlLanguages.includes(currentLang) ? 'rtl' : 'ltr';
    }
  }, [i18n.language]);

  return (
    <AuthProvider>
        <TestingModeBanner />
        <HashRouter>
            <ScrollToTop />
            <PageLayout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    
                    {/* User Dashboard */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/dashboard/:tab" element={<DashboardPage />} />

                    {/* Admin Section */}
                    <Route path="/admin-login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/admin/:tab" element={<AdminPage />} />
                </Routes>
            </PageLayout>
        </HashRouter>
    </AuthProvider>
  );
}

export default App;