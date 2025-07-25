import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { api, ApiError } from '../../services/api';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.auth.forgotPassword(email);
      setSubmitted(true);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          setError('No account found with this email address');
        } else if (error.status === 429) {
          setError('Too many requests. Please try again later.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
          
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to{' '}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                disabled={loading}
              >
                Try Different Email
              </Button>
              
              <Button
                variant="ghost"
                onClick={onBackToLogin}
                icon={ArrowLeft}
                disabled={loading}
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter your email"
            icon={Mail}
            disabled={loading}
            autoComplete="email"
            autoFocus
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading || !email}
          >
            Send Reset Link
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>
        </div>
      </div>
    </Card>
  );
};
