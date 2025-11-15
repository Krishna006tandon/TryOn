import { Search, Bell, User, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const Header = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="relative flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px] h-9"
        />
      </div>
      <div className="flex items-center gap-4 md:ml-auto">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-accent">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="p-2 rounded-full hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-accent">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
