import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  BarChart3,
  Ticket,
  Bell,
  LogOut,
  ChevronFirst,
  ChevronLast,
  MoreVertical,
} from 'lucide-react';

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/categories', label: 'Categories', icon: FolderTree },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingCart }
];

const Sidebar = ({ onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 280 : 80 }}
      className="h-screen flex flex-col bg-card border-r"
    >
      <div className="p-4 flex items-center justify-between">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
              <span className="ml-3 text-lg font-bold">TryOn</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-accent"
        >
          {isExpanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
      </div>

      <nav className="flex-1 px-3 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center h-12 px-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent',
                isExpanded ? 'justify-start' : 'justify-center'
              )}
            >
              <Icon className="w-5 h-5" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="ml-4 font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <div className="flex items-center p-2 rounded-lg bg-card">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=111827&color=f9fafb&bold=true"
            alt="Admin"
            className="w-10 h-10 rounded-md"
          />
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-between items-center ml-3"
              >
                <div className="leading-4">
                  <h4 className="font-semibold">Admin</h4>
                  <span className="text-xs text-muted-foreground">
                    admin@example.com
                  </span>
                </div>
                <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-accent">
                  <LogOut size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
