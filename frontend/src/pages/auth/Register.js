import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../../features/auth/authSlice';
import Spinner from '../../components/common/Spinner';
import logo from '../../assets/images/logo.png'; // Make sure this path is correct
import axios from 'axios';

import { login } from '../../features/auth/authSlice';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    mobile: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);

  const { name, email, password, password2, mobile, address } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  useEffect(() => {
    console.log('Register component state:', { 
      user, isLoading, isError, isSuccess, message 
    });
  }, [user, isLoading, isError, isSuccess, message]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      
      // Log the data being sent
      console.log('Sending registration data:', { name, email, password, mobile, address });
      
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        mobile,
        address
      });
      
      console.log('Registration response:', response.data);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Dispatch login success action
      dispatch(login({
        name,
        email,
        password
      }));
      
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      setLoading(false);
      const message = 
        error.response?.data?.msg || 
        error.response?.data?.message || 
        'Registration failed. Please try again.';
      toast.error(message);
      console.error('Registration error:', error);
    }
  };

  if (isLoading || loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left side - Logo and Branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 justify-center items-center flex-col p-8">
        <img src={logo} alt="Upalheri Logo" className="w-32 h-32 mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">Upalheri</h1>
        <p className="text-white text-xl text-center">
          Join the Upalheri Gram Panchayat Portal
        </p>
        <p className="text-white mt-8 text-center">
          Create an account to access community services, participate in local governance, and stay connected.
        </p>
      </div>
      
      {/* Right side - Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={onChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={onChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="text"
                  required
                  value={mobile}
                  onChange={onChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Mobile Number"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  required
                  value={address}
                  onChange={onChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Address"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={onChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password2}
                  onChange={onChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Register
              </button>
            </div>
            
            <div className="text-center">
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register; 