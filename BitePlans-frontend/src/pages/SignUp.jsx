import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { auth } from '../firebase';
import {createUserWithEmailAndPassword,GoogleAuthProvider,OAuthProvider,signInWithPopup,} from 'firebase/auth';
import { toast } from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    toast.dismiss(); // clear old toasts
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      const idToken = await user.getIdToken();

const res = await axios.post('/register', {
  email: formData.email,
  name: formData.name,
}, {
  headers: {
    Authorization: `Bearer ${idToken}`,
  },
});

      if (!res.ok) throw new Error('Failed to register user');

      login({ email: user.email, name: formData.name, id: user.uid });
      toast.success("Signup successful!");
      setTimeout(() => {
      navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Signup error:', err);

      if (err.code === 'auth/email-already-in-use' || err.message.includes('auth/email-already-in-use')) {
        toast.error('Email already in use. Try logging in instead.');
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

const res = await axios.post('/register', {
  email: user.email,
  name: user.displayName,
}, {
  headers: {
    Authorization: `Bearer ${idToken}`,
  },
});

      if (!res.ok) throw new Error('Failed to register with Google');

      login({ email: user.email, name: user.displayName, id: user.uid });
      toast.success("Signup successful!");
      setTimeout(() => {
      navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Google sign up error:', err);

      if (err.code === 'auth/account-exists-with-different-credential') {
        toast.error('Account exists with another login method. Try Microsoft or email.');
      } else {
        toast.error('Google sign-up failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftSignUp = async () => {
    setIsLoading(true);
    const provider = new OAuthProvider('microsoft.com');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

const res = await axios.post('/register', {
  email: user.email,
  name: user.displayName,
}, {
  headers: {
    Authorization: `Bearer ${idToken}`,
  },
});

      if (!res.ok) throw new Error('Failed to register with Microsoft');

      login({ email: user.email, name: user.displayName, id: user.uid });
      toast.success("Signup successful!");
      setTimeout(() => {
      navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Microsoft sign up error:', err);

      if (err.code === 'auth/account-exists-with-different-credential') {
        toast.error('Account exists with another login method. Try Google or email.');
      } else if (err.code === 'auth/user-cancelled') {
        toast.info('Microsoft sign-in cancelled by user.');
      } else {
        toast.error('Microsoft sign-up failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BitePlans
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Start Your Free Trial</h1>
            <p className="text-gray-600 dark:text-gray-300">Get 100 free credits • No credit card required</p>
          </div>

          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 mb-3"
          >
            <img src="google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Sign up with Google</span>
          </button>

          <button
            onClick={handleMicrosoftSignUp}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 mb-6"
          >
            <img src="microsoft-logo.svg" alt="Microsoft" className="w-5 h-5" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Sign up with Microsoft</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or create an account
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`} placeholder="Enter your full name" />
              {errors.name && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`} placeholder="Enter your email" />
              {errors.email && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.password ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`} placeholder="Create a password" />
              {errors.password && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.confirmPassword ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`} placeholder="Confirm your password" />
              {errors.confirmPassword && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Creating Account...' : 'Start Free Trial'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
