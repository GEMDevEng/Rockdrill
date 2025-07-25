import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { useApp, useNotifications } from '../../contexts/AppContext';
import { api, ApiError } from '../../services/api';
import { User as UserType } from '../../types';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchToLogin,
}) => {
  const { dispatch } = useApp();
  const { showNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    role: 'user' as const,
    subscription: 'free' as const,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const roleOptions = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
  ];

  const subscriptionOptions = [
    { label: 'Free Plan', value: 'free' },
    { label: 'Pro Plan', value: 'pro' },
    { label: 'Enterprise Plan', value: 'enterprise' },
  ];

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-yellow-500';
    if (strength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    return 'Strong';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
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
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and symbols.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const userData: Partial<UserType> = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        company: formData.company.trim(),
        role: formData.role,
        subscription: formData.subscription,
        preferences: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          emailNotifications: true,
          darkMode: false,
          language: 'en',
        },
      };

      const response = await api.auth.register(userData);
      
      // Store token
      localStorage.setItem('auth_token', response.token);
      
      // Update app state
      dispatch({ type: 'SET_USER', payload: response.user });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      
      showNotification('Account created successfully! Welcome to Rockdrill.', 'success');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setErrors({ email: 'An account with this email already exists' });
        } else if (error.status === 422) {
          setErrors({ general: 'Please check your information and try again' });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'Network error. Please check your connection.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update password strength
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join Rockdrill and start automating your sales</p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-700 text-sm">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            icon={User}
            error={errors.name}
            disabled={loading}
            autoComplete="name"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
            icon={Mail}
            error={errors.email}
            disabled={loading}
            autoComplete="email"
            required
          />

          <Input
            label="Company"
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            placeholder="Enter your company name"
            icon={Building}
            error={errors.company}
            disabled={loading}
            autoComplete="organization"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Role"
              options={roleOptions}
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              disabled={loading}
            />

            <Select
              label="Plan"
              options={subscriptionOptions}
              value={formData.subscription}
              onChange={(e) => handleInputChange('subscription', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Create a strong password"
              icon={Lock}
              error={errors.password}
              disabled={loading}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              icon={Lock}
              error={errors.confirmPassword}
              disabled={loading}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div className="absolute right-10 top-9 text-green-500">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              disabled={loading}
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-500 font-medium"
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </Card>
  );
};
