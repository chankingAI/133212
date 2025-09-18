import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  HomeIcon,
  PlusIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gradient">全栈网站</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-secondary-700 hover:text-primary-600 transition-colors duration-200"
            >
              <HomeIcon className="w-5 h-5 inline mr-1" />
              首页
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-secondary-700 hover:text-primary-600 transition-colors duration-200"
                >
                  仪表板
                </Link>
                <Link 
                  to="/create-post" 
                  className="text-secondary-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <PlusIcon className="w-5 h-5 inline mr-1" />
                  写文章
                </Link>
                
                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 transition-colors duration-200">
                    <UserCircleIcon className="w-6 h-6" />
                    <span>{user.username}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors duration-200"
                    >
                      <Cog6ToothIcon className="w-4 h-4 inline mr-2" />
                      个人资料
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-secondary-700 hover:text-primary-600 transition-colors duration-200"
                >
                  登录
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-secondary-700 hover:text-primary-600 transition-colors duration-200"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-secondary-200">
              <Link 
                to="/" 
                className="block px-3 py-2 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                首页
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block px-3 py-2 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    仪表板
                  </Link>
                  <Link 
                    to="/create-post" 
                    className="block px-3 py-2 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    写文章
                  </Link>
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    个人资料
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    登录
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;