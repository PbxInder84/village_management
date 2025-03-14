import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Village Management System</h1>
              </div>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Home
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* User Management Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage users, roles, and permissions.
                </p>
                <div className="mt-4">
                  <Link
                    to="/admin/users"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Manage Users
                  </Link>
                </div>
              </div>
            </div>
            
            {/* News Management Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">News Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create, edit, and publish news articles.
                </p>
                <div className="mt-4">
                  <Link
                    to="/admin/news"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Manage News
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Events Management Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Events Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create and manage village events.
                </p>
                <div className="mt-4">
                  <Link
                    to="/admin/events"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Manage Events
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Panchayat Management Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Panchayat Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage panchayat members and meetings.
                </p>
                <div className="mt-4">
                  <Link
                    to="/admin/panchayat/members"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Manage Panchayat
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Services Management Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Services Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage village services and requests.
                </p>
                <div className="mt-4">
                  <Link
                    to="/admin/services/types"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Manage Services
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Gallery Management Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Gallery Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload and manage village photos.
                </p>
                <div className="mt-4">
                  <Link
                    to="/admin/gallery"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Manage Gallery
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Document Management Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Document Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload and manage important village documents.
                </p>
                <div className="mt-4">
                  <Link
                    to="/admin/documents"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Manage Documents
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Poll Management Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">Poll Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create and manage polls and surveys.
                </p>
                <div className="mt-4">
                  <Link
                    to="/admin/polls"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Manage Polls
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 