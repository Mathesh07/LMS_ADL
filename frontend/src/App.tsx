import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { UserMenu } from "@/components/UserMenu"
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LearningPath from './pages/LearningPath'
import VerifyEmail from './pages/VerifyEmail'
import Notifications from './pages/Notifications'
import RoadmapGenerator from './pages/RoadmapGenerator'
import MyRoadmaps from './pages/MyRoadmaps'
import Groups from './pages/Groups'
import StudyGroup from './pages/StudyGroup'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import LearningPathOverview from "@/pages/LearningPathOverview"
import LearningPathContent from "@/pages/LearningPathContent"
import LearningPathNotes from "@/pages/LearningPathNotes"
import LearningPathAssign from "@/pages/LearningPathAssign"
import ForgotPassword from "./pages/ForgotPassword"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            {/* Protected routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider defaultOpen={true}>
                  <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <header className="h-12 flex items-center justify-between border-b bg-card px-4">
                        <SidebarTrigger />
                        <UserMenu />
                      </header>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/learning-path/:id" element={<LearningPath />} />
                        <Route path="/learning-path/:id/notes" element={<LearningPathNotes />} />
                        <Route path="/learning-path/overview" element={<LearningPathOverview />} />
                        <Route path="/learning-path/add-content" element={<LearningPathContent />} />
                        <Route path="/learning-path/content" element={<LearningPathContent />} />
                        <Route path="/learning-path/notes" element={<LearningPathNotes />} />
                        <Route path="/learning-path/assign-learners" element={<LearningPathAssign />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/roadmap-generator" element={<RoadmapGenerator />} />
                        <Route path="/my-roadmaps" element={<MyRoadmaps />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/group/:groupname" element={<StudyGroup />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
