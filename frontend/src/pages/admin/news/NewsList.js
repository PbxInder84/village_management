import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllNews, deleteNews, reset } from '../../../features/news/newsSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';

function NewsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { news, isLoading, isError, message } = useSelector((state) => state.news);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      dispatch(getAllNews());
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
    if (window.confirm('Are you sure you want to delete this news?')) {
      dispatch(deleteNews(id));
      toast.success('News deleted successfully');
    }
  };
  
  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-bold">News Management</h1>
        <button
          onClick={() => navigate('/admin/news/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add News
        </button>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search news..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => navigate(`/admin/news/edit/${item._id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900 mr-3"
                    >
                      Delete
                    </button>
                    <button 
                      onClick={() => navigate(`/news/${item._id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No news found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
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

export default NewsList; 