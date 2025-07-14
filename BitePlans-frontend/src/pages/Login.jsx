import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,} from 'firebase/auth';
import { auth, microsoftProvider } from '../firebase';
import { useUser } from '../context/UserContext';
import { toast } from 'react-hot-toast'; 
import axios from 'axios';

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch current user from backend using Firebase token
  const fetchUser = async (token) => {
    const res = await axios.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data;
    if (!data.success || !data.user) throw new Error('User data invalid');

    return data.user;
  };

  // Register a new user (for social logins)
const registerUser = async (token, name, email) => {
  const res = await axios.post('/register', { name, email }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.data.success) throw new Error('Registration failed');
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      const userInfo = await fetchUser(token);

      login({
        id: userCred.user.uid,
        name: userInfo.displayName,
        email: userInfo.email,
      });

      toast.success("Login successful!"); 
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your email or password.');
      toast.error("Login failed. Please check your email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // Try registering (only if new)
      await registerUser(token, user.displayName || 'User', user.email);

      const userInfo = await fetchUser(token);

      login({
        id: user.uid,
        name: userInfo.displayName,
        email: userInfo.email,
      });

      toast.success("Login successful!"); 
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Sign-in failed. Try again.');
      toast.error("Sign-in failed. Try again."); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="text-center mb-8">
            <Link to="/" className="flex justify-center items-center space-x-2 mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BitePlans
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300">Sign in to access your developer tools</p>
          </div>

          {error && (
            <p className="text-center text-red-500 text-sm mb-4">{error}</p>
          )}

          {/* Google Login */}
          <button
            onClick={() => handleSocialLogin(new GoogleAuthProvider())}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <img src="google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Continue with Google
            </span>
          </button>

          {/* Microsoft Login */}
          <button
            onClick={() => handleSocialLogin(microsoftProvider)}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <img src="microsoft-logo.svg" alt="Microsoft" className="w-5 h-5" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Continue with Microsoft
            </span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
