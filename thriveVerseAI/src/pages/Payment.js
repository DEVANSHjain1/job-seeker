import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    id: 'free',
    name: 'Free',
    credits: 2,
    price: 0,
    description: '2 free emails',
    features: ['2 AI-generated emails', 'Basic templates', 'Email editing']
  },
  {
    id: 'basic',
    name: 'Basic',
    credits: 100,
    price: 300,
    description: '100 emails for Rs 300',
    features: ['100 AI-generated emails', 'All templates', 'Priority support', 'Email history']
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 300,
    price: 800,
    description: '300 emails for Rs 800',
    features: ['300 AI-generated emails', 'All templates', 'Priority support', 'Email history', 'Advanced customization']
  }
];

const Payment = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment/purchase`,
        { planId: selectedPlan },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setSuccess('Credits purchased successfully!');
      setSelectedPlan(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to purchase credits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Purchase Credits</h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose a plan that best suits your needs
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border ${
                selectedPlan === plan.id
                  ? 'border-primary-500 shadow-lg'
                  : 'border-gray-200'
              } p-8 shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                {selectedPlan === plan.id && (
                  <CheckIcon className="h-5 w-5 text-primary-500" />
                )}
              </div>
              <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
              </p>
              <ul role="list" className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-primary-500" />
                    <span className="ml-3 text-sm text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-semibold ${
                  selectedPlan === plan.id
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50'
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handlePurchase}
            disabled={!selectedPlan || loading}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              !selectedPlan || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            }`}
          >
            {loading ? 'Processing...' : 'Purchase Credits'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment; 