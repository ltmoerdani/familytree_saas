import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialAuth from './components/SocialAuth';

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAuthSuccess = () => {
    setIsLoading(true);
    // Simulate authentication delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="TreePine" size={20} color="white" />
              </div>
              <span className="font-heading font-semibold text-xl text-primary">
                FamilyTree
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Auth Card */}
          <div className="bg-background rounded-xl shadow-modal border border-border overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-border">
              <button
                onClick={() => handleTabChange('login')}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-smooth ${
                  activeTab === 'login' ?'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-primary hover:bg-surface'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleTabChange('register')}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-smooth ${
                  activeTab === 'register' ?'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-primary hover:bg-surface'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {/* Welcome Message */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-heading font-semibold text-text-primary mb-2">
                  {activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}
                </h1>
                <p className="text-text-secondary">
                  {activeTab === 'login' ?'Sign in to access your family trees' :'Start building your family tree today'
                  }
                </p>
              </div>

              {/* Social Authentication */}
              <SocialAuth onSuccess={handleAuthSuccess} />

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-text-secondary">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Auth Forms */}
              {activeTab === 'login' ? (
                <LoginForm onSuccess={handleAuthSuccess} />
              ) : (
                <RegisterForm onSuccess={handleAuthSuccess} />
              )}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-text-secondary">
            <p>
              By continuing, you agree to our{' '}
              <Link to="#" className="text-primary hover:text-primary-600 transition-smooth">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-primary hover:text-primary-600 transition-smooth">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 flex items-center space-x-3">
            <Icon name="Loader2" size={24} className="animate-spin text-primary" />
            <span className="text-text-primary font-medium">Signing you in...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;