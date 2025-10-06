import { Toaster } from 'sonner';
import AdminDashboard from '../components/dashboard/admin-dashboard';

const DashboardLayout = () => {
  return (
    <>
      <AdminDashboard />
      <Toaster richColors position="top-center" />
    </>
  );
};

export default DashboardLayout;
