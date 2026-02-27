import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const features = [
  'AI-powered email generation',
  'Personalized content based on job description',
  'Professional tone and formatting',
  'Multiple email templates',
  'Easy to edit and customize',
];

const testimonials = [
  {
    content: "This platform helped me land my dream job! The generated emails were professional and effective.",
    author: "Sarah Johnson",
    role: "Software Engineer",
    company: "Tech Corp"
  },
  {
    content: "I was struggling with writing job application emails. This tool made the process so much easier.",
    author: "Michael Chen",
    role: "Product Manager",
    company: "StartupX"
  },
  {
    content: "The AI-generated emails were spot-on and saved me hours of writing time.",
    author: "Emily Rodriguez",
    role: "Marketing Manager",
    company: "Brand Co"
  }
];

const pricing = [
  {
    name: 'Free',
    price: '0',
    description: '2 free emails',
    features: ['2 AI-generated emails', 'Basic templates', 'Email editing'],
    cta: 'Get Started',
    href: '/register'
  },
  {
    name: 'Basic',
    price: '300',
    description: '100 emails for Rs 300',
    features: ['100 AI-generated emails', 'All templates', 'Priority support', 'Email history'],
    cta: 'Choose Basic',
    href: '/payment'
  },
  {
    name: 'Pro',
    price: '800',
    description: '300 emails for Rs 800',
    features: ['300 AI-generated emails', 'All templates', 'Priority support', 'Email history', 'Advanced customization'],
    cta: 'Choose Pro',
    href: '/payment'
  }
];

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Generate Professional Job Application Emails with AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Create personalized, engaging emails that help you stand out to recruiters. Our AI-powered platform generates professional emails based on your resume and job requirements.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={handleGetStarted}
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                {user ? 'Generate Email' : 'Get Started'}
              </button>
              <Link to="/#features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Faster Job Applications</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to write professional emails
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our AI-powered platform helps you create personalized job application emails in minutes, not hours.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <CheckIcon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                  {feature}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Services section */}
      <div id="services" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Our Services</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Email Generation Solutions
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We offer a range of services to help you create the perfect job application emails.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  AI Email Generation
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Our advanced AI system generates personalized emails based on your resume and job description.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Template Library
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Access our extensive library of professional email templates for different industries and roles.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Customization Tools
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Easy-to-use tools for customizing and fine-tuning your generated emails.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div id="testimonials" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by job seekers
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.author} className="rounded-2xl bg-gray-50 p-8">
                <p className="text-lg leading-8 text-gray-600">{testimonial.content}</p>
                <div className="mt-6 flex items-center gap-x-4">
                  <div>
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">{testimonial.author}</h3>
                    <div className="text-sm leading-6 text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div id="pricing" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for you
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">₹{plan.price}</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-6 w-5 flex-none text-primary-600" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to={plan.href}
                className="mt-8 block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing; 