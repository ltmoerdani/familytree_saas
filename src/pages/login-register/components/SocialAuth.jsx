import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SocialAuth = ({ onSuccess }) => {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSocialAuth = (provider) => {
    setLoadingProvider(provider);
    
    // Simulate social auth
    setTimeout(() => {
      setLoadingProvider(null);
      onSuccess();
    }, 1500);
  };

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      bgColor: 'bg-white hover:bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
      borderColor: 'border-blue-600'
    }
  ];

  return (
    <div className="space-y-3">
      {socialProviders.map((provider) => (
        <button
          key={provider.id}
          onClick={() => handleSocialAuth(provider.id)}
          disabled={loadingProvider !== null}
          className={`w-full flex items-center justify-center space-x-3 py-3 px-4 border rounded-lg font-medium transition-smooth disabled:opacity-50 disabled:cursor-not-allowed ${provider.bgColor} ${provider.textColor} ${provider.borderColor}`}
        >
          {loadingProvider === provider.id ? (
            <>
              <Icon name="Loader2" size={18} className="animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Icon name={provider.icon} size={18} />
              <span>Continue with {provider.name}</span>
            </>
          )}
        </button>
      ))}
    </div>
  );
};

export default SocialAuth;