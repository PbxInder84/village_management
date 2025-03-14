import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from '../../components/common/Spinner';
import logo from '../../assets/images/logo.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.post('/api/auth/forgot-password', { email });
      setIsEmailSent(true);
      
      if (response.data.previewUrl) {
        setPreviewUrl(response.data.previewUrl);
        console.log("Preview URL:", response.data.previewUrl);
      }
      
      toast.success(response.data.message || 'Password reset email sent. Please check your inbox');
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        'Failed to send password reset email. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left side - Logo and Branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 justify-center items-center flex-col p-8">
        <img src={logo} alt="Upalheri Logo" className="w-32 h-32 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Upalheri</h1>
        <p className="text-white text-xl text-center">
          Gram Panchayat Portal
        </p>
        <p className="text-white mt-8 text-center">
          We'll help you reset your password and get back to your account.
        </p>
      </div>
      
      {/* Right side - Forgot Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          {!isEmailSent ? (
            <>
              <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                Forgot your password?
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Send reset link
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <svg 
                className="mx-auto h-12 w-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Check your email</h2>
              <p className="mt-2 text-gray-600">
                We've sent a password reset link to {email}
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button 
                  onClick={() => setIsEmailSent(false)} 
                  className="text-primary-600 hover:text-primary-500"
                >
                  try again
                </button>
              </p>
              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    For testing purposes, view your email here:
                  </p>
                  <a 
                    href={previewUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-500 text-sm"
                  >
                    View Email Preview
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword; 