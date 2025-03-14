import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllGalleryItems, deleteGalleryItem, reset } from '../../../features/gallery/gallerySlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';

function GalleryList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { galleryItems, isLoading, isError, message } = useSelector((state) => state.gallery);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      dispatch(getAllGalleryItems());
    }
    
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      dispatch(deleteGalleryItem(id));
      toast.success('Gallery item deleted successfully');
    }
  };
  
  const filteredItems = galleryItems.filter(
    (item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    }
  );
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <button
          onClick={() => navigate('/admin/gallery/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add New Image
        </button>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search by title, description, or tags..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="events">Events</option>
            <option value="landmarks">Landmarks</option>
            <option value="people">People</option>
            <option value="development">Development</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={`/uploads/${item.image}`} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Category: <span className="font-medium">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                </p>
                {item.description && (
                  <p className="text-gray-700 mb-3 line-clamp-2">{item.description}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-gray-500 text-xs mb-3">
                  Added on {formatDate(item.createdAt)}
                </p>
                <div className="flex justify-between">
                  <button 
                    onClick={() => navigate(`/admin/gallery/edit/${item._id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No gallery items found.</p>
        </div>
      )}
      
      <div className="mt-6">
        <button 
          onClick={() => navigate('/admin')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default GalleryList; 