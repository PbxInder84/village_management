import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getNewsById, reset } from '../../features/news/newsSlice';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { singleNews, isLoading, isError, message } = useSelector((state) => state.news);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getNewsById(id));
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
  
  if (isLoading || !singleNews) {
    return <Spinner />;
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
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
            {singleNews.image && (
              <div className="w-full h-64 overflow-hidden">
                <img 
                  src={`/uploads/${singleNews.image}`} 
                  alt={singleNews.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{singleNews.title}</h1>
              
              <div className="flex items-center text-gray-500 text-sm mb-6">
                <span>By {singleNews.author.name}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(singleNews.createdAt)}</span>
              </div>
              
              <div className="prose max-w-none">
                {singleNews.content.split('\n').map((paragraph, index) => (
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
                    onClick={() => navigate(`/admin/news/edit/${singleNews._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit News
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

export default NewsDetail; 