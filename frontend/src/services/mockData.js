// Mock data for development - replace with actual API calls in production

export const mockUsers = [
  {
    userId: 1,
    userEmail: "admin@lms.com",
    password: "password123",
    salt: "salt123",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    avatarPublicUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    userId: 2,
    userEmail: "user@lms.com",
    password: "password123",
    salt: "salt456",
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    avatarPublicUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isVerified: true,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z"
  }
];

// Mock OTP storage
const mockOTPs = new Map();

// Mock Learning Paths
export const mockLearningPaths = [
  {
    id: 'lp-1',
    title: 'Full-Stack Web Development',
    description: 'Complete path from HTML/CSS to React and Node.js',
    difficulty: 'Intermediate',
    duration: '6 months',
    progress: 75,
    modules: 12,
    tags: ['Web Development', 'JavaScript', 'React', 'Node.js'],
    createdAt: '2024-01-01T00:00:00.000Z',
    isCustom: false
  },
  {
    id: 'lp-2',
    title: 'Data Science Fundamentals',
    description: 'Learn Python, statistics, and machine learning basics',
    difficulty: 'Beginner',
    duration: '4 months',
    progress: 45,
    modules: 8,
    tags: ['Data Science', 'Python', 'Statistics', 'ML'],
    createdAt: '2024-01-02T00:00:00.000Z',
    isCustom: true
  },
  {
    id: 'lp-3',
    title: 'Mobile App Development',
    description: 'Build iOS and Android apps with React Native',
    difficulty: 'Advanced',
    duration: '8 months',
    progress: 30,
    modules: 15,
    tags: ['Mobile Development', 'React Native', 'JavaScript'],
    createdAt: '2024-01-03T00:00:00.000Z',
    isCustom: false
  }
];

// Mock Popular Learning Modules
export const mockPopularModules = [
  {
    id: 'm-1',
    title: 'React Hooks Deep Dive',
    description: 'Master useState, useEffect, and custom hooks',
    difficulty: 'Intermediate',
    duration: '2 weeks',
    rating: 4.8,
    students: 1247,
    tags: ['React', 'JavaScript', 'Hooks'],
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
    category: 'Frontend Development'
  },
  {
    id: 'm-2',
    title: 'TypeScript Essentials',
    description: 'Learn TypeScript from basics to advanced patterns',
    difficulty: 'Beginner',
    duration: '3 weeks',
    rating: 4.9,
    students: 2156,
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop',
    category: 'Programming Languages'
  },
  {
    id: 'm-3',
    title: 'Node.js Streams & Performance',
    description: 'Optimize Node.js applications with streams',
    difficulty: 'Advanced',
    duration: '2 weeks',
    rating: 4.7,
    students: 892,
    tags: ['Node.js', 'JavaScript', 'Performance'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
    category: 'Backend Development'
  },
  {
    id: 'm-4',
    title: 'SQL Mastery',
    description: 'From basic queries to complex database design',
    difficulty: 'Beginner',
    duration: '4 weeks',
    rating: 4.6,
    students: 3421,
    tags: ['SQL', 'Database', 'Data'],
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=200&fit=crop',
    category: 'Database'
  },
  {
    id: 'm-5',
    title: 'UI/UX Design Principles',
    description: 'Create beautiful and functional user interfaces',
    difficulty: 'Intermediate',
    duration: '3 weeks',
    rating: 4.8,
    students: 1567,
    tags: ['Design', 'UI/UX', 'Figma'],
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d41294ab?w=400&h=200&fit=crop',
    category: 'Design'
  },
  {
    id: 'm-6',
    title: 'DevOps & CI/CD',
    description: 'Automate your development workflow',
    difficulty: 'Advanced',
    duration: '4 weeks',
    rating: 4.5,
    students: 734,
    tags: ['DevOps', 'CI/CD', 'Docker'],
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-51d4a4f0e8b8?w=400&h=200&fit=crop',
    category: 'DevOps'
  }
];

// Mock authentication functions
export const mockAuthService = {
  // Login
  login: async (email, password) => {
    const user = mockUsers.find(u => u.userEmail === email);
    if (user && password === "password123") { // Simple mock - in real app, verify hashed password
      return { success: true, user: { ...user, password: undefined } };
    }
    return { success: false, error: "Invalid credentials" };
  },

  // Signup
  signup: async (email, password) => {
    const existingUser = mockUsers.find(u => u.userEmail === email);
    if (existingUser) {
      return { success: false, error: "User already exists" };
    }
    
    const newUser = {
      userId: mockUsers.length + 1,
      userEmail: email,
      password: "hashedPassword",
      salt: "salt",
      avatarUrl: null,
      avatarPublicUrl: null,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    return { success: true, user: { ...newUser, password: undefined } };
  },

  // Send OTP
  sendOTP: async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    mockOTPs.set(email, { otp, timestamp: Date.now() });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`OTP for ${email}: ${otp}`); // In real app, send via email/SMS
    return { success: true, message: "OTP sent successfully" };
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    const storedOTP = mockOTPs.get(email);
    if (!storedOTP) {
      return { success: false, error: "OTP expired or not found" };
    }
    
    if (Date.now() - storedOTP.timestamp > 5 * 60 * 1000) { // 5 minutes expiry
      mockOTPs.delete(email);
      return { success: false, error: "OTP expired" };
    }
    
    if (storedOTP.otp === otp) {
      mockOTPs.delete(email);
      return { success: true, message: "OTP verified successfully" };
    }
    
    return { success: false, error: "Invalid OTP" };
  },

  // Password reset
  resetPassword: async (email, newPassword) => {
    const user = mockUsers.find(u => u.userEmail === email);
    if (!user) {
      return { success: false, error: "User not found" };
    }
    
    user.password = "hashedPassword"; // In real app, hash the password
    user.updatedAt = new Date().toISOString();
    
    return { success: true, message: "Password reset successfully" };
  },

  // Google OAuth (mock)
  googleAuth: async (googleToken) => {
    // Simulate Google OAuth verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful Google auth
    const user = {
      userId: 3,
      userEmail: "googleuser@lms.com",
      password: null,
      salt: null,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      avatarPublicUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { success: true, user };
  },

  // Generate Learning Path
  generateLearningPath: async (prompt) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock learning path generation
    const newPath = {
      id: `lp-${Date.now()}`,
      title: `Generated Path: ${prompt}`,
      description: `AI-generated learning path based on: "${prompt}"`,
      difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
      duration: `${Math.floor(Math.random() * 6) + 2} months`,
      progress: 0,
      modules: Math.floor(Math.random() * 10) + 5,
      tags: prompt.split(' ').slice(0, 3),
      createdAt: new Date().toISOString(),
      isCustom: true
    };
    
    mockLearningPaths.push(newPath);
    return { success: true, path: newPath };
  }
};
