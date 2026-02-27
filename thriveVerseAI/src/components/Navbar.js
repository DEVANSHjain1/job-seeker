import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Services', href: '/#services', current: false },
  { name: 'Testimonials', href: '/#testimonials', current: false },
  { name: 'Blog', href: '/#blog', current: false },
  { name: 'Pricing', href: '/#pricing', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['services', 'testimonials', 'blog', 'pricing'];
      const offset = 100; // Adjust this value to change when a section is considered "active"
      
      // If we're at the top of the page, set active section to home
      if (window.scrollY < offset) {
        setActiveSection('home');
        return;
      }

      // Find the section that's currently in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          const viewportMiddle = window.scrollY + (window.innerHeight / 2);

          // Check if the viewport middle is within the section's bounds
          if (viewportMiddle >= elementTop && viewportMiddle <= elementBottom) {
            setActiveSection(section);
            return;
          }
        }
      }

      // If no section is found, keep the current active section
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  };

  const handleNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show loading state in the navbar
  if (loading) {
    return (
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/" className="text-2xl font-bold text-primary-600">
                  JobSeeker
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80; // Adjust this value based on your navbar height
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' }); 
  };

  return (
    <Disclosure as="nav" className="bg-white shadow sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-2xl font-bold text-primary-600">
                    JobSeeker
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    item.name === 'Home' ? (
                      <button
                        key={item.name}
                        onClick={handleHomeClick}
                        className={classNames(
                          activeSection === 'home'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200'
                        )}
                      >
                        {item.name}
                      </button>
                    ) : (
                      <HashLink
                        smooth
                        key={item.name}
                        to={item.href}
                        scroll={scrollWithOffset}
                        className={classNames(
                          item.href.includes(activeSection)
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                          'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200'
                        )}
                      >
                        {item.name}
                      </HashLink>
                    )
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleNavigation('/dashboard')}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Dashboard
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block w-full text-left px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/login"
                      className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
              {/* Mobile menu button */}
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                item.name === 'Home' ? (
                  <button
                    key={item.name}
                    onClick={handleHomeClick}
                    className={classNames(
                      activeSection === 'home'
                        ? 'bg-primary-50 border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                      'block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200'
                    )}
                  >
                    {item.name}
                  </button>
                ) : (
                  <HashLink
                    smooth
                    key={item.name}
                    to={item.href}
                    scroll={scrollWithOffset}
                    className={classNames(
                      item.href.includes(activeSection)
                        ? 'bg-primary-50 border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                      'block border-l-4 py-2 pl-3 pr-4 text-base font-medium transition-colors duration-200'
                    )}
                  >
                    {item.name}
                  </HashLink>
                )
              ))}
            </div>
            {user ? (
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="space-y-1">
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="space-y-1">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar; 