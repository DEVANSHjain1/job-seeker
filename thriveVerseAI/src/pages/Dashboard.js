import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    resume: '',
    additionalDetails: ''
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState(0);
  const { user, loading: authLoading, checkAuth } = useAuth();
  const navigate = useNavigate();

  const fetchCredits = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/payment/balance`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCredits(response.data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
      if (error.response?.status === 401) {
        await checkAuth(); // Try to refresh auth state
        if (!localStorage.getItem('token')) {
          navigate('/login');
        }
      }
    }
  }, [navigate, checkAuth]);

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!authLoading) {
        if (!user) {
          const token = localStorage.getItem('token');
          if (token) {
            await checkAuth(); // Try to refresh auth state
            if (!user) {
              navigate('/login');
              return;
            }
          } else {
            navigate('/login');
            return;
          }
        }
        if (user) {
          fetchCredits();
        }
      }
    };

    initializeDashboard();
  }, [user, authLoading, navigate, fetchCredits, checkAuth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedEmail('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        await checkAuth(); // Try to refresh auth state
        if (!localStorage.getItem('token')) {
          navigate('/login');
          return;
        }
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/query/generate`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setGeneratedEmail(response.data.email);
      setCredits(response.data.remainingCredits);

      if (response.data.remainingCredits <= 0) {
        navigate('/payment');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        await checkAuth(); // Try to refresh auth state
        if (!localStorage.getItem('token')) {
          navigate('/login');
          return;
        }
      }
      
      setError(error.response?.data?.message || 'Failed to generate email');
      
      if (error.response?.status === 403 && error.response?.data?.message?.includes('credits')) {
        navigate('/payment');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Credits remaining:</span>
            <span className="text-lg font-semibold text-primary-600">{credits}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Email</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                  Job Description *
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.jobDescription}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                  Your Resume *
                </label>
                <textarea
                  id="resume"
                  name="resume"
                  rows={4}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.resume}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="additionalDetails" className="block text-sm font-medium text-gray-700">
                  Additional Details (Optional)
                </label>
                <textarea
                  id="additionalDetails"
                  name="additionalDetails"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.additionalDetails}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading || credits <= 0}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading || credits <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                {loading ? 'Generating...' : 'Generate Email'}
              </button>
            </form>
          </div>

          {/* Generated Email */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Generated Email</h2>
              {generatedEmail && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Copy
                </button>
              )}
            </div>
            <div className="prose max-w-none">
              {generatedEmail ? (
                <div className="whitespace-pre-wrap">{generatedEmail}</div>
              ) : (
                <p className="text-gray-500">Your generated email will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 