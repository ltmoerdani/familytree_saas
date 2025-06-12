import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock credentials for demo
  const mockCredentials = {
    email: 'demo@familytree.com',
    password: 'Demo123!',
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Check mock credentials
      if (
        formData.email === mockCredentials.email &&
        formData.password === mockCredentials.password
      ) {
        onSuccess();
      } else {
        setErrors({
          general:
            'Invalid email or password. Use demo@familytree.com / Demo123!',
        });
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* General Error */}
      {errors.general && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-3 flex items-start space-x-2">
          <Icon
            name="AlertCircle"
            size={16}
            className="text-error-500 mt-0.5 flex-shrink-0"
          />
          <span className="text-sm text-error-700">{errors.general}</span>
        </div>
      )}

      {/* Demo Credentials Info */}
      <div className="bg-accent-50 border border-accent-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon
            name="Info"
            size={16}
            className="text-accent-600 mt-0.5 flex-shrink-0"
          />
          <div className="text-sm text-accent-800">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Email: {mockCredentials.email}</p>
            <p>Password: {mockCredentials.password}</p>
          </div>
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth ${
              errors.email
                ? 'border-error-300 bg-error-50'
                : 'border-border bg-background hover:border-primary-300'
            }`}
            placeholder="Enter your email"
          />
          <Icon
            name="Mail"
            size={18}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              errors.email ? 'text-error-400' : 'text-text-secondary'
            }`}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-error-600 flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.email}</span>
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth ${
              errors.password
                ? 'border-error-300 bg-error-50'
                : 'border-border bg-background hover:border-primary-300'
            }`}
            placeholder="Enter your password"
          />
          <Icon
            name="Lock"
            size={18}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              errors.password ? 'text-error-400' : 'text-text-secondary'
            }`}
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-error-600 flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.password}</span>
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary-500 focus:ring-2"
            aria-describedby="remember-me-description"
          />
          <span className="text-sm text-text-secondary">Remember me</span>
        </label>
        <p id="remember-me-description" className="sr-only">
          Keep me signed in on this device
        </p>

        <Link
          to="#"
          className="text-sm text-primary hover:text-primary-600 transition-smooth"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 focus:outline-none"
        aria-label={isSubmitting ? 'Signing in...' : 'Sign in to your account'}
      >
        {isSubmitting ? (
          <>
            <Icon name="Loader2" size={18} className="animate-spin" />
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <Icon name="LogIn" size={18} />
            <span>Sign In</span>
          </>
        )}
      </button>
    </form>
  );
};

// PropTypes validation for strict prop checking
LoginForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default LoginForm;
