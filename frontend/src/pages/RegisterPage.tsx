import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      // Calculate password strength (simple version)
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
    
    if (name === 'confirmPassword' || name === 'password') {
      const otherField = name === 'password' ? 'confirmPassword' : 'password';
      setPasswordMismatch(value !== formData[otherField] && formData[otherField] !== '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-600';
      default: return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Sign up to start ordering delicious campus food
              </p>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded flex items-start">
                <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password strength meter */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center mb-1">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getPasswordStrengthColor()}`} 
                          style={{ width: `${passwordStrength * 25}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <div className="flex items-center">
                        <Check size={12} className={`mr-1 ${
                          formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <span>At least 8 characters</span>
                      </div>
                      <div className="flex items-center">
                        <Check size={12} className={`mr-1 ${
                          /[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <span>Contains uppercase letter</span>
                      </div>
                      <div className="flex items-center">
                        <Check size={12} className={`mr-1 ${
                          /[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <span>Contains number</span>
                      </div>
                      <div className="flex items-center">
                        <Check size={12} className={`mr-1 ${
                          /[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <span>Contains special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className={`w-full px-3 py-2 border ${
                      passwordMismatch ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="mt-1 text-xs text-red-500">
                    Passwords do not match
                  </p>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading || passwordMismatch}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></span>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-orange-600 dark:text-orange-400 hover:text-orange-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
            
            <div className="mt-8 text-xs text-center text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-orange-600 dark:text-orange-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-orange-600 dark:text-orange-400 hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;