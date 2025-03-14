import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGalleryById, reset } from '../../features/gallery/gallerySlice';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

function GalleryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { galleryItem, isLoading, isError, message } = useSelector((state) => state.gallery);
  
  useEffect(() => {
    dispatch(getGalleryById(id));
    
    return () => {
      dispatch(reset());
    };
  }, [id, dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
      navigate('/gallery');
    }
  }, [isError, message, navigate]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (isLoading || !galleryItem) {
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
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="relative">
              <img 
                src={`/uploads/${galleryItem.image}`} 
                alt={galleryItem.title} 
                className="w-full h-auto max-h-96 object-contain bg-gray-100"
              />
              <div className="absolute top-0 left-0 m-4">
                <button
                  onClick={() => navigate('/gallery')}
                  className="bg-white bg-opacity-75 hover:bg-opacity-100 text-gray-800 px-3 py-1 rounded-full shadow transition-colors"
                >
                  ← Back to Gallery
                </button>
              </div>
              {user && user.role === 'admin' && (
                <div className="absolute top-0 right-0 m-4">
                  <button
                    onClick={() => navigate(`/admin/gallery/edit/${galleryItem._id}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full shadow hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2">{galleryItem.title}</h1>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                  {galleryItem.category.charAt(0).toUpperCase() + galleryItem.category.slice(1)}
                </span>
                
                {galleryItem.tags && galleryItem.tags.length > 0 && (
                  galleryItem.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))
                )}
              </div>
              
              {galleryItem.description && (
                <div className="mb-6">
                  <p className="text-gray-700 whitespace-pre-line">{galleryItem.description}</p>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                <p>Added on {formatDate(galleryItem.createdAt)}</p>
                {galleryItem.createdBy && (
                  <p>By {galleryItem.createdBy.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GalleryDetail; 