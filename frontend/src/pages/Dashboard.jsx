import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LeftSidebar from '../components/dashboard/LeftSidebar';
import TopNavbar from '../components/dashboard/TopNavbar';
import ContentGrid from '../components/dashboard/ContentGrid';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-[256px,1fr] gap-4">
        <LeftSidebar />
        <main className="min-h-[calc(100vh-64px)] rounded-2xl border bg-card p-4 md:p-6">
          <TopNavbar />
          <div className="mt-4">
            <ContentGrid />
          </div>
        </main>
      </div>
    </div>
  );
};


export default Dashboard
