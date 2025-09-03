// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format date to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(dateString);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Generate initials from name or email
export const getInitials = (nameOrEmail) => {
  if (!nameOrEmail) return '?';
  
  if (nameOrEmail.includes('@')) {
    // Extract name from email
    const name = nameOrEmail.split('@')[0];
    return name.charAt(0).toUpperCase();
  }
  
  // Split name and get initials
  const names = nameOrEmail.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Very Weak' };
  
  let score = 0;
  const feedback = [];
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  let label = 'Very Weak';
  if (score >= 5) label = 'Very Strong';
  else if (score >= 4) label = 'Strong';
  else if (score >= 3) label = 'Good';
  else if (score >= 2) label = 'Weak';
  
  return { score, label };
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random OTP
export const generateOTP = (length = 6) => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * Math.pow(10, length - 1)).toString();
};

// Check if user is admin (mock function)
export const isAdmin = (user) => {
  return user?.userEmail === 'admin@lms.com';
};

// Get user role
export const getUserRole = (user) => {
  if (isAdmin(user)) return 'Admin';
  return 'User';
};
