import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from '../../components/common/Spinner';
import logo from '../../assets/images/logo.png';

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();
  
  const { password, confirmPassword } = formData;
  
  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setIsLoading(true);
        await axios.get(`/api/auth/reset-password/${token}`);
        setIsTokenValid(true);
      } catch (error) {
        setIsTokenValid(false);
        toast.error('Invalid or expired password reset token');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyToken();
  }, [token]);
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsLoading(true);
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setIsSuccess(true);
      toast.success('Password has been reset successfully');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        'Failed to reset password. Please try again.';
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
          Create a new password to secure your account.
        </p>
      </div>
      
      {/* Right side - Reset Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          {!isTokenValid ? (
            <div className="text-center">
              <svg 
                className="mx-auto h-12 w-12 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Invalid or Expired Link</h2>
              <p className="mt-2 text-gray-600">
                The password reset link is invalid or has expired.
              </p>
              <div className="mt-6">
                <Link 
                  to="/forgot-password" 
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Request a new link
                </Link>
              </div>
            </div>
          ) : isSuccess ? (
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
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Password Reset Successful</h2>
              <p className="mt-2 text-gray-600">
                Your password has been reset successfully.
              </p>
              <p className="mt-1 text-gray-500">
                You will be redirected to the login page shortly.
              </p>
              <div className="mt-6">
                <Link 
                  to="/login" 
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Go to login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                Reset your password
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Please enter your new password below.
              </p>
              
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={onChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={onChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword; 