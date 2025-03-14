import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getActivePolls, reset } from '../../features/polls/pollSlice';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

function PollList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { polls, isLoading, isError, message } = useSelector((state) => state.polls);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(getActivePolls());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No end date';
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
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
              {user ? (
                <div className="flex items-center space-x-4">
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Home
                  </Link>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link 
                    to="/login" 
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Polls and Surveys</h1>
          </div>
          
          {polls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {polls.map((poll) => (
                <div key={poll._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>
                    
                    {poll.description && (
                      <p className="text-gray-600 mb-4">{poll.description}</p>
                    )}
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Options:</span> {poll.options.length}
                      </p>
                      {poll.endDate && (
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Ends:</span> {formatDate(poll.endDate)}
                        </p>
                      )}
                    </div>
                    
                    <Link
                      to={`/polls/${poll._id}`}
                      className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                    >
                      View Poll
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-gray-500">No active polls at the moment.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PollList; 