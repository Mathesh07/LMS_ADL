# Learning Management System (LMS) Frontend

A modern, responsive frontend application for a Learning Management System built with React, featuring comprehensive authentication and a beautiful user interface.

## 🚀 Features

### Authentication System
- **User Registration** with email verification via OTP
- **User Login** with email/password
- **Google OAuth** integration (mock implementation)
- **Password Reset** with OTP verification
- **OTP Verification** for email verification and password reset
- **Protected Routes** - Dashboard only accessible to authenticated users

### User Interface
- **Modern Design** with gradient backgrounds and smooth animations
- **Responsive Layout** that works on all device sizes
- **Beautiful Forms** with validation and error handling
- **Loading States** with spinners and progress indicators
- **Success/Error Messages** for user feedback

### Mock Data & Services
- **Mock User Database** with sample users
- **Mock Authentication Service** for development and testing
- **OTP Generation & Verification** simulation
- **Google OAuth Mock** for testing

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ProtectedRoute.jsx
├── contexts/           # React contexts for state management
│   └── AuthContext.jsx
├── hooks/              # Custom React hooks
│   └── useFormValidation.js
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   └── Dashboard.jsx
├── services/           # API and service functions
│   └── mockData.js
├── styles/             # CSS styles
│   └── index.css
├── utils/              # Utility functions
│   └── helpers.js
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## 🛠️ Technologies Used

- **React 19** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **CSS3** - Custom styling with modern features
- **Vite** - Fast build tool and development server

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔐 Demo Credentials

For testing purposes, you can use these mock credentials:

### Admin User
- **Email:** admin@lms.com
- **Password:** password123

### Regular User
- **Email:** user@lms.com
- **Password:** password123

## 📱 Pages & Routes

### Public Routes
- `/login` - User login page
- `/signup` - User registration page
- `/forgot-password` - Password reset page

### Protected Routes
- `/dashboard` - Main dashboard (requires authentication)
- `/` - Redirects to login page

## 🎨 Design Features

- **Gradient Backgrounds** - Beautiful purple-blue gradients
- **Card-based Layout** - Clean, organized content presentation
- **Smooth Animations** - Hover effects and transitions
- **Modern Typography** - Inter font family for readability
- **Responsive Grid** - Adaptive layout for different screen sizes
- **Interactive Elements** - Hover states and focus indicators

## 🔧 Customization

### Styling
The application uses custom CSS with CSS variables for easy theming. Main styles are in `src/styles/index.css`.

### Mock Data
Mock data and services can be found in `src/services/mockData.js`. Replace these with actual API calls when connecting to a backend.

### Authentication
The authentication logic is centralized in `src/contexts/AuthContext.jsx` and can be easily modified or extended.

## 🧪 Testing Features

- **OTP Verification** - 6-digit code input with auto-focus
- **Form Validation** - Real-time validation with error messages
- **Loading States** - Visual feedback during API calls
- **Error Handling** - Comprehensive error messages and recovery
- **Responsive Design** - Test on different screen sizes

## 🔒 Security Features

- **Protected Routes** - Authentication required for dashboard access
- **Form Validation** - Client-side and server-side validation
- **Secure Authentication** - Mock implementation ready for real auth
- **Session Management** - Local storage for user persistence

## 🚀 Future Enhancements

- **Real Backend Integration** - Replace mock services with actual APIs
- **Real-time Features** - WebSocket integration for live updates
- **Advanced Analytics** - User progress tracking and reporting
- **File Upload** - Profile picture and document management
- **Multi-language Support** - Internationalization (i18n)
- **Dark Mode** - Theme switching capability
- **PWA Features** - Offline support and app-like experience

## 📝 Development Notes

### Mock Services
All authentication services are currently mocked for development purposes. When integrating with a real backend:

1. Replace `mockAuthService` calls in `AuthContext.jsx`
2. Update API endpoints in service files
3. Implement real OTP sending (email/SMS)
4. Add proper error handling for network issues

### State Management
The application uses React Context for global state management. For larger applications, consider using:
- Redux Toolkit
- Zustand
- React Query for server state

### Performance
- Components are optimized with React.memo where appropriate
- Lazy loading can be implemented for route-based code splitting
- Image optimization for avatars and media content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using React and modern web technologies**
