import React, { useState } from 'react';
import { Zap, Shield, TrendingUp, Users, Mail, BarChart3 } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgot-password';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const features = [
    {
      icon: Users,
      title: 'Lead Management',
      description: 'Import, enrich, and organize your leads with AI-powered insights',
    },
    {
      icon: Mail,
      title: 'Email Automation',
      description: 'Create personalized email sequences that convert prospects',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track performance and optimize your sales campaigns',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with SOC 2 compliance and data encryption',
    },
    {
      icon: TrendingUp,
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations to improve your outreach',
    },
    {
      icon: Zap,
      title: 'Seamless Integrations',
      description: 'Connect with your favorite CRM, email, and sales tools',
    },
  ];

  const renderAuthForm = () => {
    switch (mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToRegister={() => setMode('register')}
            onForgotPassword={() => setMode('forgot-password')}
          />
        );
      case 'register':
        return (
          <RegisterForm
            onSwitchToLogin={() => setMode('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBackToLogin={() => setMode('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left Side - Branding and Features */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-12">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-white">Rockdrill</h1>
            </div>
            
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                AI-Powered SDR Automation
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Transform your sales development process with intelligent lead management, 
                automated outreach, and data-driven insights.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-blue-100 text-sm">
              Trusted by 10,000+ sales teams worldwide
            </p>
            <div className="flex items-center justify-center space-x-8 mt-4">
              {/* Company logos would go here */}
              <div className="w-16 h-8 bg-white/20 rounded"></div>
              <div className="w-16 h-8 bg-white/20 rounded"></div>
              <div className="w-16 h-8 bg-white/20 rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Authentication Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Rockdrill</h1>
            </div>

            {renderAuthForm()}

            {/* Mobile Features */}
            <div className="lg:hidden mt-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Why choose Rockdrill?
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                      <p className="text-gray-600 text-xs">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
