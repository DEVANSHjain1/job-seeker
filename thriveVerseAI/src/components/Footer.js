import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link to="/privacy" className="text-gray-400 hover:text-gray-500">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-gray-400 hover:text-gray-500">
            Terms of Service
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-gray-500">
            Contact
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} JobSeeker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 