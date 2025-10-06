import {
  Users,
  Settings,
  Store,
  ChartNoAxesCombined,
  Megaphone,
  Bell,
  NotebookTabs,
  Ban,
  Logs,
  LucideMilestone,
  Shield,
  LogOut,
  Settings2,
  LucideTowerControl,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { logOut, seletCurrentUser } from '../../redux/features/auth/authSlice';

const AdminSidebar = () => {
  const user = useAppSelector(seletCurrentUser);

  const isSuperAdmin = user?.role === 'superadmin';

  const adminManagementItem = isSuperAdmin
    ? [
        {
          title: 'Admin management',
          icon: LucideTowerControl,
          view: 'adminManagement' as const,
          path: 'admin-management',
        },
      ]
    : [];

  const menuItems = [
    {
      title: 'Announcement',
      icon: Megaphone,
      view: 'coffee' as const,
      path: 'announcement',
    },
    {
      title: 'Analytics & Usage Tracking',
      icon: ChartNoAxesCombined,
      view: 'analytics' as const,
      path: 'analytics-and-tracking',
    },
    {
      title: 'User Management',
      icon: Users,
      view: 'users' as const,
      path: 'user-management',
    },
    {
      title: 'Coffee Shop Management',
      icon: Store,
      view: 'coffee' as const,
      path: 'coffee-shop-management',
    },
    {
      title: 'Plan Limits',
      icon: LucideMilestone,
      view: 'plan-limits' as const,
      path: 'plan-limits',
    },
    {
      title: 'Notes',
      icon: NotebookTabs,
      view: 'notes' as const,
      path: 'notes',
    },
    {
      title: 'Ban Ip',
      icon: Ban,
      view: 'ban ip' as const,
      path: 'ban-ip',
    },
    {
      title: 'Admin Logs',
      icon: Logs,
      view: 'logs' as const,
      path: 'admin-logs',
    },
    {
      title: 'Paywall Control',
      icon: Shield,
      view: 'paywall' as const,
      path: 'paywall-control',
    },
    {
      title: 'Notifications',
      icon: Bell,
      view: 'notifications' as const,
      path: 'notifications',
    },
    {
      title: 'Settings',
      icon: Settings2,
      view: 'settings' as const,
      path: 'settings',
    },
  ];

  const allMenuItems = [...menuItems, ...adminManagementItem];

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Clear auth tokens or user session data
    // Navigate to login
    navigate('/');
    dispatch(logOut());
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-4">
          <Settings className="h-6 w-6" />
          <span className="font-semibold text-lg">Admin Dashboard</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {allMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <NavLink to={`/dashboard/admin/${item.path}`}>
                    <SidebarMenuButton
                      isActive={
                        `/dashboard/admin/${item.path}` === location.pathname
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </NavLink>
                </SidebarMenuItem>
              ))}

              {/* Logout Item */}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
