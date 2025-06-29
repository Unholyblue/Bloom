import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authService } from '../utils/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

type AuthMode = 'signin' | 'signup' | 'forgot-password';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const result = await authService.signUp(email, password, fullName);
        if (result.success) {
          setSuccess('Please check your email to confirm your account before signing in.');
          setMode('signin');
        } else {
          setError(result.error || 'Sign up failed');
        }
      } else if (mode === 'signin') {
        const result = await authService.signIn(email, password);
        if (result.success) {
          onClose();
        } else {
          // Enhanced error handling for invalid credentials
          let errorMessage = result.error || 'Sign in failed';
          if (errorMessage.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please double-check your credentials and ensure your email is confirmed if you recently signed up.';
          }
          setError(errorMessage);
        }
      } else if (mode === 'forgot-password') {
        const result = await authService.resetPassword(email);
        if (result.success) {
          setSuccess('Password reset email sent. Please check your inbox.');
        } else {
          setError(result.error || 'Password reset failed');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setSuccess(null);
    setShowPassword(false);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-calm border border-soft-blue-200/50 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-soft-blue-200/50">
          <h2 className="text-2xl font-light bg-gradient-to-r from-soft-blue-600 to-muted-teal-600 bg-clip-text text-transparent">
            {mode === 'signin' ? 'Welcome Back' : 
             mode === 'signup' ? 'Join Bloom' : 
             'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600 hover:text-therapy-gray-800 transition-all duration-200 hover:scale-105"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-therapy-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-therapy-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-soft-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-blue-300 focus:border-transparent bg-white/80 backdrop-blur-sm text-black"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-therapy-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-therapy-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-soft-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-blue-300 focus:border-transparent bg-white/80 backdrop-blur-sm text-black"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            {mode !== 'forgot-password' && (
              <div>
                <label className="block text-sm font-medium text-therapy-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-therapy-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-soft-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-blue-300 focus:border-transparent bg-white/80 backdrop-blur-sm text-black"
                    placeholder="Enter your password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-therapy-gray-400 hover:text-therapy-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-soft-blue-400 to-muted-teal-400 hover:from-soft-blue-500 hover:to-muted-teal-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-gentle hover:shadow-calm"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 
               mode === 'signup' ? 'Create Account' : 
               'Send Reset Email'}
            </button>
          </form>

          {/* Mode Switching */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <p className="text-sm text-therapy-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-soft-blue-600 hover:text-soft-blue-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
                <p className="text-sm text-therapy-gray-600">
                  <button
                    onClick={() => switchMode('forgot-password')}
                    className="text-soft-blue-600 hover:text-soft-blue-700 font-medium"
                  >
                    Forgot your password?
                  </button>
                </p>
              </>
            )}
            
            {mode === 'signup' && (
              <p className="text-sm text-therapy-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-soft-blue-600 hover:text-soft-blue-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
            
            {mode === 'forgot-password' && (
              <p className="text-sm text-therapy-gray-600">
                Remember your password?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-soft-blue-600 hover:text-soft-blue-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}