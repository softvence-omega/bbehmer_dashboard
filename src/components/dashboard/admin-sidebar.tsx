import { Users, Settings, Store, ChartNoAxesCombined, Megaphone, Bell, NotebookTabs, CreditCard, ShoppingBasket, UsersIcon, Ban, Logs, LucideMilestone, Shield, LogOut, Settings2, LucideTowerControl } from "lucide-react"
import { 
    Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, } from "../ui/sidebar"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../redux/hook"
import { logOut } from "../../redux/features/auth/authSlice"



const AdminSidebar =() => {
  const menuItems = [
    {
      title:"Announcement",
      icon : Megaphone,
      view: "coffee" as const,
      path: "announcement"
    },
    {
      title:"Analytics & Usage Tracking",
      icon: ChartNoAxesCombined,
      view: "analytics" as const,
      path: "analytics-and-tracking"
    },
    {
      title: "User Management",
      icon: Users,
      view: "users" as const,
      path: "user-management"
    },
    { title: "Admin management",
      icon: LucideTowerControl, 
      view: "adminManagement" as const,
      path:"admin-management"},
    {
      title:"Coffee Shop Management",
      icon : Store,
      view: "coffee" as const,
      path: "coffee-shop-management"
    },
    {
      title:"Stripe Plan Management",
      icon: CreditCard,
      view: "plan" as const,
      path: "plan"
    },
    {
      title:"Plan Limits",
      icon: LucideMilestone,
      view: "plan-limits" as const,
      path: "plan-limits"
    },
    {
      title:"Product Management",
      icon: ShoppingBasket,
      view: "product",
      path: "products"
    },
    {
      title:"Notes",
      icon: NotebookTabs,
      view: "notes" as const,
      path: "notes"
    },
    {
      title:"Customers",
      icon: UsersIcon,
      view: "customers" as const,
      path: "customer"
    },
    {
      title:"Ban Ip",
      icon: Ban,
      view:'ban ip' as const,
      path:"ban-ip"
    },
    {
      title:"Admin Logs",
      icon:Logs,
      view:'logs' as const,
      path:'admin-logs'
    },
    {
      title: "Paywall Control",
      icon: Shield,
      view: "paywall" as const,
      path: "paywall-control"
    },
    {
      title:"Notifications",
      icon: Bell,
      view: "notifications" as const,
      path: "notifications"
    },
    {
      title:"Settings",
      icon: Settings2,
      view: "settings" as const,
      path: "settings"
    },
  ]

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Clear auth tokens or user session data
    // Navigate to login
    navigate("/");
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
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <NavLink to={`/dashboard/admin/${item.path}`}>
                  <SidebarMenuButton isActive={`/dashboard/admin/${item.path}` === location.pathname}>
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
  )
}

export default AdminSidebar;
