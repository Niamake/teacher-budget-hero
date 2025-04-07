
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BadgeDollarSign, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationItem {
  name: string;
  path: string;
  hasDropdown: boolean;
  dropdownItems?: {
    name: string;
    path: string;
  }[];
}

interface NavigationItemsProps {
  closeMobileMenu?: () => void;
  isMobile?: boolean;
}

const NavigationItems = ({ closeMobileMenu, isMobile = false }: NavigationItemsProps) => {
  const location = useLocation();

  const navItems: NavigationItem[] = [
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

  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const isDropdownActive = (item: NavigationItem) => {
    if (!item.hasDropdown || !item.dropdownItems) return false;
    return item.dropdownItems.some(subItem => isPathActive(subItem.path));
  };

  // Mobile navigation
  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-6 py-8">
        {navItems.map((item) => (
          item.hasDropdown ? (
            <div key={item.path} className="space-y-2">
              <div className="text-lg font-medium text-foreground/80">{item.name}</div>
              <div className="pl-4 space-y-2 border-l border-border">
                {item.dropdownItems?.map((subItem) => (
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
      </nav>
    );
  }

  // Desktop navigation
  return (
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
              {item.dropdownItems?.map((subItem) => (
                <DropdownMenuItem key={subItem.path} asChild>
                  <Link
                    to={subItem.path}
                    className={`w-full flex items-center cursor-pointer ${
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
  );
};

export default NavigationItems;
