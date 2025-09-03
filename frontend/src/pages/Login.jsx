import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Toast from '../components/Toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        setToast({ show: true, message: 'Login successful!', type: 'success' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setToast({ show: true, message: result.error, type: 'error' });
      }
    } catch (err) {
      setToast({ show: true, message: 'Login failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      // Mock Google token - in real app, this would come from Google OAuth
      const mockGoogleToken = 'mock_google_token_123';
      const result = await googleLogin(mockGoogleToken);
      if (result.success) {
        setToast({ show: true, message: 'Google login successful!', type: 'success' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setToast({ show: true, message: result.error, type: 'error' });
      }
    } catch (err) {
      setToast({ show: true, message: 'Google authentication failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Branding */}
          <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-12 lg:p-16 flex flex-col items-center justify-center text-center min-h-[500px] lg:min-h-[600px]">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Welcome to LMS</h2>
            <p className="text-lg opacity-90 leading-relaxed max-w-md">
              Your gateway to knowledge and growth. Start your learning journey today.
            </p>
            <div className="w-48 h-48 lg:w-56 lg:h-56 mt-8 opacity-90">
              <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
                {/* Self-learning related SVG */}
                <path d="M100 20c-44.18 0-80 35.82-80 80s35.82 80 80 80 80-35.82 80-80-35.82-80-80-80zm0 140c-33.14 0-60-26.86-60-60s26.86-60 60-60 60 26.86 60 60-26.86 60-60 60z"/>
                <path d="M100 50c-27.61 0-50 22.39-50 50s22.39 50 50 50 50-22.39 50-50-22.39-50-50-50zm0 80c-16.57 0-30-13.43-30-30s13.43-30 30-30 30 13.43 30 30-13.43 30-30 30z"/>
                <path d="M85 70h30v10H85z"/>
                <path d="M85 90h30v10H85z"/>
                <path d="M85 110h20v10H85z"/>
                <circle cx="70" cy="80" r="5"/>
                <circle cx="70" cy="100" r="5"/>
                <circle cx="70" cy="120" r="5"/>
              </svg>
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="flex-1 p-12 lg:p-16 bg-white dark:bg-gray-800">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                <p className="text-gray-600 dark:text-gray-400">Sign in to your Learning Management System account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 hover:border-blue-500 hover:bg-white dark:hover:bg-gray-600 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:-translate-y-0.5"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm transition-all duration-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 hover:border-blue-500 hover:bg-white dark:hover:bg-gray-600 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:-translate-y-0.5"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      onClick={togglePassword}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-base transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-semibold text-base border-2 border-gray-200 dark:border-gray-600 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg width="20" height="20" viewBox="0 0 24 24">
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
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </div>
              </button>

              <div className="mt-8 text-center space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition-colors duration-200">
                    Sign up
                  </Link>
                </p>
                <p>
                  <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition-colors duration-200">
                    Forgot your password?
                  </Link>
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Demo Credentials:</strong>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Email: admin@lms.com | Password: password123
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Email: user@lms.com | Password: password123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Login;
