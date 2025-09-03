import { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthService } from '../services/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('lms_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await mockAuthService.login(email, password);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('lms_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        return result;
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (email, password) => {
    try {
      const result = await mockAuthService.signup(email, password);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('lms_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        return result;
      }
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const googleLogin = async (googleToken) => {
    try {
      const result = await mockAuthService.googleAuth(googleToken);
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem('lms_user', JSON.stringify(result.user));
        return { success: true };
      } else {
        return result;
      }
    } catch (error) {
      return { success: false, error: 'Google authentication failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('lms_user');
  };

  const sendOTP = async (email) => {
    return await mockAuthService.sendOTP(email);
  };

  const verifyOTP = async (email, otp) => {
    return await mockAuthService.verifyOTP(email, otp);
  };

  const resetPassword = async (email, newPassword) => {
    return await mockAuthService.resetPassword(email, newPassword);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    googleLogin,
    logout,
    sendOTP,
    verifyOTP,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
