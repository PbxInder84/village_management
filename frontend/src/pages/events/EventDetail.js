import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEventById, reset } from '../../features/events/eventSlice';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { singleEvent, isLoading, isError, message } = useSelector((state) => state.events);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getEventById(id));
    }
    
    return () => {
      dispatch(reset());
    };
  }, [id, user, navigate, dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
      navigate('/');
    }
  }, [isError, message, navigate]);
  
  if (isLoading || !singleEvent) {
    return <Spinner />;
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: '2-digit', weekday: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {singleEvent.image && (
              <div className="w-full h-64 overflow-hidden">
                <img 
                  src={`/uploads/${singleEvent.image}`} 
                  alt={singleEvent.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{singleEvent.title}</h1>
              
              <div className="flex flex-col md:flex-row md:items-center text-gray-500 text-sm mb-6">
                <div className="flex items-center mb-2 md:mb-0">
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{formatDate(singleEvent.date)}</span>
                </div>
                
                <span className="hidden md:block mx-2">•</span>
                
                <div className="flex items-center mb-2 md:mb-0">
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{singleEvent.time}</span>
                </div>
                
                <span className="hidden md:block mx-2">•</span>
                
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{singleEvent.location}</span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                {singleEvent.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </button>
                
                {user && user.role === 'admin' && (
                  <button
                    onClick={() => navigate(`/admin/events/edit/${singleEvent._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit Event
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EventDetail; 