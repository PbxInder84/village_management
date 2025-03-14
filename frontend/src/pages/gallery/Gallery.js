import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGalleryItems, getGalleryByCategory, reset } from '../../features/gallery/gallerySlice';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

function Gallery() {
  const dispatch = useDispatch();
  
  const { galleryItems, isLoading, isError, message } = useSelector((state) => state.gallery);
  const { user } = useSelector((state) => state.auth);
  
  const [activeCategory, setActiveCategory] = useState('all');
  
  useEffect(() => {
    dispatch(getGalleryItems());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    
    if (category === 'all') {
      dispatch(getGalleryItems());
    } else {
      dispatch(getGalleryByCategory(category));
    }
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
            <h1 className="text-3xl font-bold">Village Gallery</h1>
          </div>
          
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleCategoryChange('events')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'events'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => handleCategoryChange('landmarks')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'landmarks'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Landmarks
              </button>
              <button
                onClick={() => handleCategoryChange('people')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'people'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                People
              </button>
              <button
                onClick={() => handleCategoryChange('development')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'development'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Development
              </button>
              <button
                onClick={() => handleCategoryChange('other')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'other'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Other
              </button>
            </div>
          </div>
          
          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link to={`/gallery/${item._id}`}>
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={`/uploads/${item.image}`} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-700 mb-3 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                      <Link 
                        to={`/gallery/${item._id}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-gray-500">No gallery items found in this category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Gallery; 