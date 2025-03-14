import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../features/auth/authSlice';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Spinner from '../components/common/Spinner';

const Profile = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        await dispatch(getCurrentUser()).unwrap();
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // If token is invalid, redirect to login
        if (error.includes('Token is not valid') || error.includes('No token found')) {
          navigate('/login');
        }
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchUserData();
  }, [dispatch, navigate]);
  
  if (isLoading || loadingProfile) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner />
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 text-center">
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
          
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                {user.avatar ? (
                  <img 
                    src={`/uploads/${user.avatar}`} 
                    alt={user.name || 'User'} 
                    className="h-40 w-40 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl text-gray-500">
                      {user.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold mb-4">{user.name || 'User'}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg">{user.email || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-lg capitalize">{user.role || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="text-lg">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  
                  {user.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-lg">{user.phone}</p>
                    </div>
                  )}
                  
                  {user.address && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-lg">{user.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 