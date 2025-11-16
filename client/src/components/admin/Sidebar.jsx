import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
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
      animate={{ width: isExpanded ? 260 : 80 }}
      className="h-screen fixed left-0 top-0 flex flex-col bg-card border-r shadow-lg z-40"
    >
      {/* HEADER */}
      <div className="p-4 flex items-center justify-between border-b">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
              <span className="ml-3 text-xl font-bold">TryOn</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          {isExpanded ? <ChevronFirst /> : <ChevronLast />}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-1 px-2 mt-4 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center h-12 px-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-accent',
                isExpanded ? 'justify-start' : 'justify-center'
              )}
            >
              <Icon className="w-5 h-5" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.18 }}
                    className="ml-4 text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto border-t p-4">
        <div className={cn(
          "flex items-center rounded-lg p-2 bg-muted",
          isExpanded ? "justify-between" : "justify-center"
        )}>
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=111827&color=f9fafb&bold=true"
            alt="Admin"
            className="w-10 h-10 rounded-md"
          />

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between w-full ml-3"
              >
                <div>
                  <h4 className="font-semibold text-sm">Admin</h4>
                  <span className="text-xs text-muted-foreground">
                    admin@example.com
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-accent"
                >
                  <LogOut size={18} />
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
