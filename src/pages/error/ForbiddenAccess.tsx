import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/button';

const AccessDenied = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-black flex items-center justify-center px-4"
    >
      <div className="max-w-md w-full bg-zinc-900 rounded-xl p-8 text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="h-12 w-12 text-yellow-400 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-sm text-zinc-400 mb-6">
          This page is restricted. You must be logged in as an admin to
          continue.
        </p>

        <Button className="w-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition">
          Login as Admin
        </Button>
      </div>
    </motion.div>
  );
};

export default AccessDenied;
