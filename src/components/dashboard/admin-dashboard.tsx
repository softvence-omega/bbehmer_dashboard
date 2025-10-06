import { SidebarProvider } from '../ui/sidebar';
import AdminSidebar from './admin-sidebar';
import { Outlet } from 'react-router-dom';
import MobileNavbar from './admin-menu-for-mobile';

const AdminDashboard = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-hidden mb-20">
          <Outlet />
        </main>
        <MobileNavbar />
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
