/**
 * Authentication Screen for HeatShield AI
 * Visual Identity: Clean Light Blue + White (#2563EB, #EFF6FF, #F7FAFC, #FFFFFF, #172033)
 * Supports Google Sign-In (Primary), Email/Password, and Instant Guest Access.
 */

import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
} from 'firebase/auth';
import {
  Flame,
  Mail,
  Lock,
  ArrowRight,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle2,
  Loader2,
  UserCheck,
  ShieldCheck,
  X,
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { initializeUserProfile } from '../../services/userService';

interface AuthScreenProps {
  onAuthSuccess: (uid: string, email: string | null) => void;
  onSkip?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, onSkip }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getReadableAuthError = (code: string): string => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please check and try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. You can sign in below instead.';
      case 'auth/operation-not-allowed':
        return 'Email/Password authentication is disabled. Please use "Continue with Google" or "Continue as Guest" below.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful attempts. Please wait a few moments and try again.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in popup was closed before finishing.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by your browser. Please allow popups for this site and try again.';
      default:
        return 'Authentication failed. Please use Google sign-in or Continue as Guest.';
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setErrorCode(null);
    setSuccessMessage(null);
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await initializeUserProfile(user.uid, user.email, user.displayName);
      onAuthSuccess(user.uid, user.email);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setErrorCode(error.code || null);
      setErrorMessage(getReadableAuthError(error.code || ''));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setErrorMessage(null);
    setErrorCode(null);
    setSuccessMessage(null);
    setGuestLoading(true);

    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      await initializeUserProfile(user.uid, null, 'Guest User');
      onAuthSuccess(user.uid, null);
    } catch (error: any) {
      console.error('Guest sign-in error:', error);
      // Fallback: If anonymous auth is disabled on project, allow onSkip
      if (onSkip) {
        onSkip();
      } else {
        setErrorMessage('Could not sign in as guest. Please use Google Sign-In.');
      }
    } finally {
      setGuestLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await initializeUserProfile(userCredential.user.uid, userCredential.user.email);
      onAuthSuccess(userCredential.user.uid, userCredential.user.email);
    } catch (error: any) {
      console.error('Sign in error:', error);
      setErrorCode(error.code || null);
      setErrorMessage(getReadableAuthError(error.code || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide an email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await initializeUserProfile(userCredential.user.uid, userCredential.user.email);
      onAuthSuccess(userCredential.user.uid, userCredential.user.email);
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        try {
          const signInCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
          await initializeUserProfile(signInCredential.user.uid, signInCredential.user.email);
          onAuthSuccess(signInCredential.user.uid, signInCredential.user.email);
          return;
        } catch (signInErr: any) {
          setMode('signin');
          setErrorCode('auth/email-already-in-use');
          setErrorMessage(
            'This account already exists. Please enter your password to sign in or use "Continue with Google".'
          );
          return;
        }
      }
      setErrorCode(error.code || null);
      setErrorMessage(getReadableAuthError(error.code || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMessage('Password reset link sent! Please check your email inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setErrorCode(error.code || null);
      setErrorMessage(getReadableAuthError(error.code || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans text-[#172033]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-600 shadow-xs text-white">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#172033] tracking-tight">
              HeatShield <span className="text-blue-600 font-bold">AI</span>
            </h1>
            <p className="text-xs font-normal text-[#64748B] mt-0.5">
              Know the heat. Stay safe.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="mt-6 bg-white py-7 px-5 sm:px-8 rounded-3xl shadow-xs border border-[#DCE6F2] space-y-5">
          {/* Primary Action Buttons: Google Sign-In & Guest Access */}
          <div className="space-y-2.5">
            <button
              id="btn-google-auth"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || guestLoading || loading}
              className="w-full py-2.5 px-4 rounded-xl border border-[#DCE6F2] bg-white hover:bg-slate-50 text-[#172033] font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <button
              id="btn-guest-auth"
              type="button"
              onClick={onSkip || handleGuestSignIn}
              disabled={googleLoading || guestLoading || loading}
              className="w-full py-2.5 px-4 rounded-xl border border-blue-200 bg-[#EFF6FF] hover:bg-blue-100 text-blue-700 font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {guestLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  <span>Entering HeatShield...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Instant Access (Explore Dashboard)</span>
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DCE6F2]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#64748B] font-medium text-[11px]">Or use email</span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' ? (
            <div className="flex bg-[#F7FAFC] p-1 rounded-xl border border-[#DCE6F2]">
              <button
                type="button"
                id="auth-tab-signin"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setErrorCode(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-[#172033] shadow-xs font-semibold'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                Sign In
              </button>
              <button
                type="button"
                id="auth-tab-signup"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  setErrorCode(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-[#172033] shadow-xs font-semibold'
                    : 'text-[#64748B] hover:text-[#172033]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                Create Account
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#172033]">Reset Password</h2>
                <p className="text-[11px] text-[#64748B]">We will email you a secure link to reset it.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                  setErrorCode(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-xs text-rose-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span className="font-normal">{errorMessage}</span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Form depending on mode */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signin-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#DCE6F2] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F7FAFC]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage(null);
                      setErrorCode(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-normal cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signin-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#DCE6F2] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F7FAFC]"
                  />
                </div>
              </div>

              <button
                id="btn-submit-signin"
                type="submit"
                disabled={loading || googleLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#DCE6F2] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F7FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Create Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#DCE6F2] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F7FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-confirmpassword-input"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#DCE6F2] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F7FAFC]"
                  />
                </div>
              </div>

              <button
                id="btn-submit-signup"
                type="submit"
                disabled={loading || googleLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Enter your registered email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="forgot-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#DCE6F2] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#F7FAFC]"
                  />
                </div>
              </div>

              <button
                id="btn-submit-forgot"
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  'Send Password Reset Email'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-[#64748B] space-y-1">
          <p className="font-medium text-[#172033]">
            Know the heat. Stay safe.
          </p>
          <p className="text-[11px] text-[#64748B]">
            Public Heat Health Intelligence • Powered by 100% Real Open-Meteo Streams
          </p>
        </div>
      </div>
    </div>
  );
};
