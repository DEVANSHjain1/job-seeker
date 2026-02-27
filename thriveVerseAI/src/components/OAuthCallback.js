import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      console.log('OAuth callback initiated');
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const error = params.get('error');

      console.log('Token present:', !!token);
      console.log('Error present:', !!error);

      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=' + error);
        return;
      }

      if (token) {
        console.log('Setting token in localStorage');
        localStorage.setItem('token', token);
        
        console.log('Checking authentication');
        try {
          const userData = await checkAuth();
          console.log('Auth check result:', userData);
          
          if (userData) {
            console.log('Authentication successful, navigating to dashboard');
            navigate('/dashboard');
          } else {
            console.log('Authentication failed, redirecting to login');
            navigate('/login');
          }
        } catch (error) {
          console.error('Auth check error:', error);
          navigate('/login');
        }
      } else {
        console.log('No token found, redirecting to login');
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default OAuthCallback; 