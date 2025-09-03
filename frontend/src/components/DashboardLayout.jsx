import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Home, Route as RouteIcon, BookOpen, StickyNote, Users, Globe2, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Learning Path', href: '/dashboard/learning-path', icon: RouteIcon },
  { label: 'Modules', href: '/dashboard/modules', icon: BookOpen },
  { label: 'Notes', href: '/dashboard/notes', icon: StickyNote },
  { label: 'Study Groups', href: '/dashboard/groups', icon: Users },
  { label: 'Metaspace', href: '/dashboard/metaspace', icon: Globe2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

function DashboardLayout({ children }) {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <SidebarProvider>
      <ShadSidebar>
        <SidebarHeader className="p-2">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="size-6 rounded-md bg-primary text-primary-foreground grid place-items-center text-[10px] font-bold">LMS</div>
            <span className="text-sm font-medium">LMS</span>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(({ label, href, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={location.pathname === href}>
                      <Link to={href}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme" className="justify-start">
            {isDarkMode ? <Sun /> : <Moon />}
            <span>Theme</span>
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </ShadSidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 p-2 border-b">
          <SidebarTrigger />
          <div className="text-sm text-muted-foreground">Dashboard</div>
        </div>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default DashboardLayout