
import { useState, useEffect } from 'react';
import { Menu, X, UserCircle, LogOut, Settings, Sun, Moon, BadgeDollarSign, Clock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { 
      name: 'Salary', 
      path: '/salary',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Salary Management', path: '/salary' },
        { name: 'Per Session Hours', path: '/per-session-hours' }
      ]
    },
    { name: 'Budget Management', path: '/budgeting', hasDropdown: false },
    { name: 'Job Information', path: '/job-info', hasDropdown: false },
    { name: 'Retirement', path: '/retirement', hasDropdown: false },
    { name: 'Tax Estimate', path: '/tax-estimate', hasDropdown: false },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error signing out");
    }
  };
  
  const getUserInitials = () => {
    if (!user) return "U";
    
    // Try to get initials from metadata first
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    
    // Fallback to email
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return "U";
  };

  const handleAuthNavigation = (path) => {
    // Store current location to redirect back after auth
    localStorage.setItem('redirectAfterAuth', location.pathname);
    navigate(path);
    closeMobileMenu();
  };
  
  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const isDropdownActive = (item) => {
    if (!item.hasDropdown) return false;
    return item.dropdownItems.some(subItem => isPathActive(subItem.path));
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? theme === 'dark' 
            ? 'bg-gray-900/90 backdrop-blur-md shadow-sm' 
            : 'bg-white/90 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold"
            onClick={closeMobileMenu}
          >
            <span className="text-gradient">TeacherFinance</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <DropdownMenu key={item.path}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`text-sm font-medium transition-all duration-200 hover:text-primary flex items-center ${
                        isPathActive(item.path) || isDropdownActive(item)
                          ? 'text-primary'
                          : 'text-foreground/80'
                      }`}
                    >
                      {item.name}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    {item.dropdownItems.map((subItem) => (
                      <DropdownMenuItem key={subItem.path} asChild>
                        <Link
                          to={subItem.path}
                          className={`w-full cursor-pointer ${
                            isPathActive(subItem.path) ? 'text-primary' : ''
                          }`}
                        >
                          {subItem.name === 'Salary Management' && <BadgeDollarSign className="mr-2 h-4 w-4" />}
                          {subItem.name === 'Per Session Hours' && <Clock className="mr-2 h-4 w-4" />}
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-all duration-200 hover:text-primary ${
                    isPathActive(item.path)
                      ? 'text-primary'
                      : 'text-foreground/80'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0" aria-label="User menu">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt={user?.email || 'Guest user'} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user ? getUserInitials() : "G"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {user ? (
                  <>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">Guest User</p>
                      <p className="text-xs text-muted-foreground">Not signed in</p>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                  {theme === 'dark' ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user ? (
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => handleAuthNavigation('/auth')} className="cursor-pointer">
                      <span>Log In</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAuthNavigation('/auth?tab=signup')} className="cursor-pointer">
                      <span>Sign Up</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button
            className="md:hidden text-foreground p-2 focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-background pt-20 px-6 md:hidden transition-all duration-300 ease-in-out z-40 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col space-y-6 py-8">
          {navItems.map((item) => (
            item.hasDropdown ? (
              <div key={item.path} className="space-y-2">
                <div className="text-lg font-medium text-foreground/80">{item.name}</div>
                <div className="pl-4 space-y-2 border-l border-border">
                  {item.dropdownItems.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`flex items-center text-sm ${
                        isPathActive(subItem.path)
                          ? 'text-primary'
                          : 'text-foreground/80'
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {subItem.name === 'Salary Management' && <BadgeDollarSign className="mr-2 h-4 w-4" />}
                      {subItem.name === 'Per Session Hours' && <Clock className="mr-2 h-4 w-4" />}
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg font-medium transition-all duration-200 ${
                  isPathActive(item.path)
                    ? 'text-primary'
                    : 'text-foreground/80'
                }`}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            )
          ))}
          <hr className="border-border my-4" />
          
          {user ? (
            <>
              <div className="flex items-center space-x-3 py-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={user.email || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user.user_metadata?.first_name} {user.user_metadata?.last_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Link 
                to="/profile" 
                className="flex items-center text-foreground/80"
                onClick={closeMobileMenu}
              >
                <UserCircle className="mr-2 h-5 w-5" />
                Profile
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center text-foreground/80"
                onClick={closeMobileMenu}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                className="justify-start text-lg font-medium"
                onClick={() => handleAuthNavigation('/auth')}
              >
                Log In
              </Button>
              <Button 
                className="justify-start text-lg font-medium"
                onClick={() => handleAuthNavigation('/auth?tab=signup')}
              >
                Sign Up
              </Button>
            </>
          )}
          <button
            className="flex items-center text-foreground/80 w-full text-left"
            onClick={() => {
              toggleTheme();
              closeMobileMenu();
            }}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="mr-2 h-5 w-5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-5 w-5" />
                Dark Mode
              </>
            )}
          </button>
          {user && (
            <Button 
              variant="destructive" 
              className="justify-start text-lg font-medium"
              onClick={() => {
                handleSignOut();
                closeMobileMenu();
              }}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Log Out
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
