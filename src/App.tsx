import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ThemeToggle } from './components/ThemeToggle';
import { AuthForm } from './components/AuthForm';
import { SymmetricPage } from './pages/SymmetricPage';
import { DESPage } from './pages/DESPage';
import { AsymmetricPage } from './pages/AsymmetricPage';
import { HashPage } from './pages/HashPage';
import { MD5Page } from './pages/MD5Page';
import { SignaturesPage } from './pages/SignaturesPage';
import { supabase } from './lib/supabase';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Crypto Lab</h1>
              <div className="flex items-center space-x-4">
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                {!user ? (
                  <button
                    onClick={() => setShowAuthForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Sign In
                  </button>
                ) : (
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
          <Navigation />
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {showAuthForm && !user ? (
            <div className="flex justify-center items-center">
              <AuthForm onSuccess={() => setShowAuthForm(false)} />
            </div>
          ) : (
            <Routes>
              <Route path="/" element={
                <div className="text-center py-12">
                  <h1 className="text-4xl font-bold mb-4">Welcome to Crypto Lab</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Explore and learn about cryptographic algorithms through interactive demonstrations
                  </p>
                </div>
              } />
              <Route path="/symmetric/aes" element={<SymmetricPage />} />
              <Route path="/symmetric/des" element={<DESPage />} />
              <Route path="/asymmetric" element={<AsymmetricPage />} />
              <Route path="/hash/sha256" element={<HashPage />} />
              <Route path="/hash/md5" element={<MD5Page />} />
              <Route path="/signatures" element={<SignaturesPage />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App