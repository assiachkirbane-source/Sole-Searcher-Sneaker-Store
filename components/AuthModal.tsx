'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/state';
import { X } from 'lucide-react';

interface AuthModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
}

export function AuthModal({ isVisible, onClose, initialMode }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { login, register } = useAuth();

  useEffect(() => setMode(initialMode), [initialMode]);
  
  useEffect(() => {
    if(isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; }
  }, [isVisible]);

  const validateEmail = (email: string) => {
    if (!email) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address.";
    return null;
  }

  const validatePassword = (password: string) => {
    if (!password) return "Password is required.";
    if (mode === 'register' && password.length < 8) return "Password must be at least 8 characters long.";
    return null;
  }
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const currentEmailError = validateEmail(email);
    const currentPasswordError = validatePassword(password);
    setEmailError(currentEmailError);
    setPasswordError(currentPasswordError);

    if (currentEmailError || currentPasswordError) return;

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onClose();
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setEmail('');
    setPassword('');
    setErrorMessage(null);
    setEmailError(null);
    setPasswordError(null);
  };

  if (!isVisible) return null;

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div onClick={onClose} className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold leading-6 text-gray-900" id="modal-title">
                  {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
                </h3>
                <button onClick={onClose} type="button" className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-6">
                <form onSubmit={handleFormSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                      <div className="mt-2">
                        <input value={email} onChange={e => setEmail(e.target.value)} id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"/>
                        {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                      <div className="mt-2">
                        <input value={password} onChange={e => setPassword(e.target.value)} id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"/>
                        {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
                      </div>
                    </div>
                    {errorMessage && <p className="mt-1 text-sm text-red-600 text-center">{errorMessage}</p>}
                    <div>
                      <button type="submit" className="w-full flex justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed">
                        {mode === 'login' ? 'Sign in' : 'Create account'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:px-6 justify-center">
              <p className="text-sm text-gray-600">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} className="font-semibold text-black hover:underline">
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
