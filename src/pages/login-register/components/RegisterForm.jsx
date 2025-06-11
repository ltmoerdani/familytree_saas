import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'Very Weak', color: 'text-error-600' };
      case 2: return { text: 'Weak', color: 'text-warning-600' };
      case 3: return { text: 'Fair', color: 'text-warning-500' };
      case 4: return { text: 'Good', color: 'text-success-600' };
      case 5: return { text: 'Strong', color: 'text-success-700' };
      default: return { text: '', color: '' };
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  const strengthIndicator = getPasswordStrengthText();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-text-primary mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth ${
              errors.firstName 
                ? 'border-error-300 bg-error-50' :'border-border bg-background hover:border-primary-300'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-error-600 flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.firstName}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-text-primary mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth ${
              errors.lastName 
                ? 'border-error-300 bg-error-50' :'border-border bg-background hover:border-primary-300'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-error-600 flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.lastName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
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
                ? 'border-error-300 bg-error-50' :'border-border bg-background hover:border-primary-300'
            }`}
            placeholder="john@example.com"
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
        <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
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
                ? 'border-error-300 bg-error-50' :'border-border bg-background hover:border-primary-300'
            }`}
            placeholder="Create a strong password"
          />
          <Icon 
            name="Lock" 
            size={18} 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              errors.password ? 'text-error-400' : 'text-text-secondary'
            }`}
          />
        </div>
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex space-x-1 mb-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded ${
                    level <= passwordStrength
                      ? passwordStrength <= 2
                        ? 'bg-error-500'
                        : passwordStrength <= 3
                        ? 'bg-warning-500' :'bg-success-500' :'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
            <p className={`text-xs ${strengthIndicator.color}`}>
              Password strength: {strengthIndicator.text}
            </p>
          </div>
        )}
        
        {errors.password && (
          <p className="mt-1 text-sm text-error-600 flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.password}</span>
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth ${
              errors.confirmPassword 
                ? 'border-error-300 bg-error-50' :'border-border bg-background hover:border-primary-300'
            }`}
            placeholder="Confirm your password"
          />
          <Icon 
            name="Lock" 
            size={18} 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              errors.confirmPassword ? 'text-error-400' : 'text-text-secondary'
            }`}
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-error-600 flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.confirmPassword}</span>
          </p>
        )}
      </div>

      {/* Terms Acceptance */}
      <div>
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className={`w-4 h-4 text-primary border-border rounded focus:ring-primary-500 focus:ring-2 mt-0.5 ${
              errors.acceptTerms ? 'border-error-300' : ''
            }`}
          />
          <span className="text-sm text-text-secondary">
            I agree to the{' '}
            <a href="#" className="text-primary hover:text-primary-600 transition-smooth">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:text-primary-600 transition-smooth">
              Privacy Policy
            </a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1 text-sm text-error-600 flex items-center space-x-1">
            <Icon name="AlertCircle" size={14} />
            <span>{errors.acceptTerms}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <Icon name="Loader2" size={18} className="animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <Icon name="UserPlus" size={18} />
            <span>Create Account</span>
          </>
        )}
      </button>
    </form>
  );
};

export default RegisterForm;