
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Sun, Moon, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

interface UserMenuProps {
  closeMobileMenu?: () => void;
  isMobile?: boolean;
}

const UserMenu = ({ closeMobileMenu, isMobile = false }: UserMenuProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

  // Mobile version
  if (isMobile) {
    return (
      <>
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
            <Button 
              variant="ghost" 
              className="justify-start w-full text-foreground/80"
              onClick={() => {
                navigate('/profile');
                if (closeMobileMenu) closeMobileMenu();
              }}
            >
              <UserCircle className="mr-2 h-5 w-5" />
              Profile
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start w-full text-foreground/80"
              onClick={() => {
                navigate('/settings');
                if (closeMobileMenu) closeMobileMenu();
              }}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              className="justify-start w-full text-lg font-medium"
              onClick={() => {
                navigate('/auth');
                if (closeMobileMenu) closeMobileMenu();
              }}
            >
              Log In
            </Button>
            <Button 
              className="justify-start w-full text-lg font-medium"
              onClick={() => {
                navigate('/auth?tab=signup');
                if (closeMobileMenu) closeMobileMenu();
              }}
            >
              Sign Up
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          className="flex items-center w-full justify-start text-foreground/80"
          onClick={() => {
            toggleTheme();
            if (closeMobileMenu) closeMobileMenu();
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
        </Button>
        {user && (
          <Button 
            variant="destructive" 
            className="justify-start text-lg font-medium"
            onClick={() => {
              handleSignOut();
              if (closeMobileMenu) closeMobileMenu();
            }}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Button>
        )}
      </>
    );
  }

  // Desktop version
  return (
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
              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/profile')}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Button>
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
            <DropdownMenuItem asChild>
              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/auth')}>
                <span>Log In</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/auth?tab=signup')}>
                <span>Sign Up</span>
              </Button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
