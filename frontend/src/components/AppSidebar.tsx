import { useState } from "react"
import { 
  FileText, 
  Clock, 
  Share2, 
  Archive, 
  Layout,
  Heart,
  FolderOpen,
  Plus,
  TrendingUp,
  Bot,
  Map,
  Users,
  BookOpen,
  BarChart3,
  Lightbulb,
  MoreVertical,
  User,
  Settings,
  LogOut,
  Globe
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "Dashboard", url: "/", icon: Layout },
  { title: "AI Roadmap Generator", url: "/roadmap-generator", icon: Bot },
  { title: "My Learning Paths", url: "/my-roadmaps", icon: Map },
  { title: "Study Groups", url: "/groups", icon: Users },
  { title: "Metaspace", url: "/metaspace", icon: Globe },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
]

const recentRoadmaps = [
  { title: "Cybersecurity Fundamentals", url: "/roadmap/cybersecurity", icon: FileText, progress: 65 },
  { title: "Full Stack Development", url: "/roadmap/fullstack", icon: FileText, progress: 30 },
  { title: "Data Science Basics", url: "/roadmap/datascience", icon: FileText, progress: 85 },
  { title: "UI/UX Design Mastery", url: "/roadmap/uiux", icon: FileText, progress: 45 },
]

const studyGroups = [
  { title: "Cyber Security Study Group", url: "/group/cybersecurity", icon: Users, color: "bg-red-100 text-red-600", members: 12 },
  { title: "React Developers", url: "/group/react", icon: Users, color: "bg-blue-100 text-blue-600", members: 8 },
  { title: "AI/ML Enthusiasts", url: "/group/aiml", icon: Users, color: "bg-purple-100 text-purple-600", members: 15 },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-accent text-accent-foreground font-medium shadow-sm" 
      : "hover:bg-muted/50 transition-colors"

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-card border-r border-border">
        {/* Brand */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <h2 className="font-semibold text-foreground">LMS</h2>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="px-2">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Roadmaps */}
        {!isCollapsed && (
          <SidebarGroup className="px-2">
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground flex items-center justify-between">
              Recent Roadmaps
              <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs">
                {recentRoadmaps.length}
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentRoadmaps.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="w-4 h-4" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm truncate block">{item.title}</span>
                          <div className="w-full bg-muted rounded-full h-1 mt-1">
                            <div 
                              className="bg-primary h-1 rounded-full transition-all" 
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Study Groups */}
        {!isCollapsed && (
          <SidebarGroup className="px-2">
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground flex items-center justify-between">
              My Study Groups
              <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-xs">
                {studyGroups.length}
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {studyGroups.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm truncate block">{item.title}</span>
                          <span className="text-xs text-muted-foreground">{item.members} members</span>
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Profile Section */}
        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">JD</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john.doe@example.com</p>
              </div>
            )}
            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <NavLink to="/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/settings" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}