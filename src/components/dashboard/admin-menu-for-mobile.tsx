import { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Coffee,
  LayoutDashboard,
  Bell,
  Megaphone,
  ShoppingBasket,
  NotebookTabs,
  Ban,
  Logs,
  Menu,
  X,
  Shield,
  LucideMilestone,
  LogOut,
  Settings2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hook';
import { logOut } from '../../redux/features/auth/authSlice';
import { Button } from '../ui/button';

const tabs = [
  { name: 'User Management', icon: User, path: 'user-management' },
  { name: 'Analytics', icon: LayoutDashboard, path: 'analytics-and-tracking' },
  {
    name: 'Coffee Shop Management',
    icon: Coffee,
    path: 'coffee-shop-management',
  },
  { name: 'Notifications', icon: Bell, path: 'notifications' },
  { name: 'Announcement', icon: Megaphone, path: 'announcement' },
  { name: 'Paywall Control', icon: Shield, path: 'paywall-control' },
  // { name: 'Plan Management', icon: CreditCard, path: 'plan' },
  { name: 'Plan Limits', icon: LucideMilestone, path: 'plan-limits' },
  { name: 'Product Management', icon: ShoppingBasket, path: 'products' },
  { name: 'Notes', icon: NotebookTabs, path: 'notes' },
  // { name: 'Customers', icon: UsersIcon, path: 'customer' },
  { name: 'Ban Ip', icon: Ban, path: 'ban-ip' },
  { name: 'Admin Logs', icon: Logs, path: 'admin-logs' },
  // {
  //   name: 'Admin management',
  //   icon: LucideTowerControl,
  //   path: 'admin-management',
  // },
  { name: 'Settings', icon: Settings2, path: 'settings' },
];

const MobileNavbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Clear auth tokens or user session data
    // Navigate to login
    navigate('/');
    dispatch(logOut());
  };

  return (
    <div className="transition-all duration-500 ease-in-out">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'sm:hidden flex flex-col items-center border justify-center px-2 rounded-lg bg-gray-90 py-2 h-fit fixed top-5 right-3 w-fit text-sm transition-all',
          open ? 'text-white' : 'text-zinc-400',
        )}
      >
        <motion.div
          initial={false}
          animate={{
            y: open ? -4 : 0,
            scale: open ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.div>
        {/* <span className="mt-1">{tab.name}</span> */}

        {open && (
          <motion.div
            layoutId="active-pill"
            className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-md"
          />
        )}
      </button>
      <div
        className={`fixed ${open ? 'left-0' : '-left-10'} md:hidden duration-1000 transition-all  top-20 flex-col px-3 w-fit rounded-r-lg inset-x-0 bg-zinc-900 border-t border-zinc-700 flex justify-around py-2 z-50 shadow-xl`}
      >
        {/* <Link key={index} to={`/dashboard/admin/${tab.path}`}> */}

        {/* </Link> */}
        {open &&
          tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = index === activeIndex;

            return (
              <Link key={index} to={`/dashboard/admin/${tab.path}`}>
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveIndex(index);
                  }}
                  className={cn(
                    'flex gap-1 items-center justify-center px-0 py-3 h-full relative text-sm transition-all',
                    isActive ? 'text-white' : 'text-zinc-400',
                  )}
                >
                  <motion.div
                    className="flex gap-x-2 pl-3 items-center"
                    initial={false}
                    animate={{
                      y: isActive ? -4 : 0,
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="mt-1">{tab.name}</span>
                  </motion.div>

                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute bottom-1.5 -left-2 right-0 h-3/4 w-1 bg-white rounded-t-md"
                    />
                  )}
                </button>
              </Link>
            );
          })}
        <Button
          className={`${open ? 'flex' : 'hidden'}`}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileNavbar;
