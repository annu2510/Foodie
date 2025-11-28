import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, ShoppingCart, User, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  // Check scroll position to change header style
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const headerClasses = `
    fixed top-0 w-full z-50 transition-all duration-300 ease-in-out
    ${isScrolled 
      ? 'bg-white dark:bg-gray-800 shadow-md py-2' 
      : 'bg-transparent py-4'}
  `;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-orange-600 flex items-center">
          Foodie
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link 
            to="/" 
            className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 font-medium"
          >
            Home
          </Link>
          <Link 
            to="/menu" 
            className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 font-medium"
          >
            Menu
          </Link>
          <Link 
            to="/about" 
            className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 font-medium"
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 font-medium"
          >
            Contact
          </Link>
          {isAuthenticated && (
            <>
            <Link 
              to="/orders" 
              className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 font-medium"
            >
              My Orders
            </Link>
              <Link 
                to="/profile" 
                className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 font-medium"
              >
                Profile
              </Link>
            </>
          )}
          {isAdmin && (
            <Link 
              to="/admin" 
              className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 font-medium"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Cart Button */}
          <Link 
            to="/cart" 
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={toggleProfile}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-500">
                  <img 
                    src={user?.profileImage || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    My Orders
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
            >
              <User size={16} className="mr-2" />
              Login
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Menu
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Contact
            </Link>
            {isAuthenticated && (
              <>
              <Link 
                to="/orders" 
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                My Orders
              </Link>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Profile
                </Link>
              </>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Admin Dashboard
              </Link>
            )}
            {!isAuthenticated && (
              <Link 
                to="/login" 
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Login / Register
              </Link>
            )}
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="flex w-full items-center px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;