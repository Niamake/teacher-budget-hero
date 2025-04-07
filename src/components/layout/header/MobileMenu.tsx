
import React from 'react';
import { Link } from 'react-router-dom';
import NavigationItems from './NavigationItems';
import UserMenu from './UserMenu';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <div
      className={`fixed inset-0 bg-background pt-20 px-6 md:hidden transition-all duration-300 ease-in-out z-40 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <NavigationItems closeMobileMenu={onClose} isMobile={true} />
      <hr className="border-border my-4" />
      <UserMenu closeMobileMenu={onClose} isMobile={true} />
    </div>
  );
};

export default MobileMenu;
