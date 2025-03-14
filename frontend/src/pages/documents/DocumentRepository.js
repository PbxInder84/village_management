import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPublicDocuments, getDocumentsByCategory, reset } from '../../features/documents/documentSlice';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

function DocumentRepository() {
  const dispatch = useDispatch();
  
  const { documents, isLoading, isError, message } = useSelector((state) => state.documents);
  const { user } = useSelector((state) => state.auth);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(getPublicDocuments());
    
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
      dispatch(getPublicDocuments());
    } else {
      dispatch(getDocumentsByCategory(category));
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return 'file-pdf';
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return 'file-word';
    } else if (fileType.includes('excel') || fileType.includes('sheet')) {
      return 'file-excel';
    } else if (fileType.includes('powerpoint') || fileType.includes('presentation')) {
      return 'file-powerpoint';
    } else if (fileType.includes('zip') || fileType.includes('compressed')) {
      return 'file-archive';
    } else if (fileType.includes('text') || fileType.includes('plain')) {
      return 'file-alt';
    } else {
      return 'file';
    }
  };
  
  const getCategoryName = (category) => {
    switch (category) {
      case 'meeting_minutes':
        return 'Meeting Minutes';
      case 'budgets':
        return 'Budgets';
      case 'policies':
        return 'Policies';
      case 'forms':
        return 'Forms';
      case 'reports':
        return 'Reports';
      case 'announcements':
        return 'Announcements';
      case 'other':
        return 'Other';
      default:
        return category;
    }
  };
  
  const filteredDocuments = documents.filter(
    (doc) => {
      return (
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
  );
  
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
            <h1 className="text-3xl font-bold">Document Repository</h1>
          </div>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                onClick={() => handleCategoryChange('meeting_minutes')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'meeting_minutes'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Meeting Minutes
              </button>
              <button
                onClick={() => handleCategoryChange('budgets')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'budgets'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Budgets
              </button>
              <button
                onClick={() => handleCategoryChange('policies')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'policies'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Policies
              </button>
              <button
                onClick={() => handleCategoryChange('forms')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'forms'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Forms
              </button>
              <button
                onClick={() => handleCategoryChange('reports')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'reports'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => handleCategoryChange('announcements')}
                className={`px-4 py-2 rounded-full ${
                  activeCategory === 'announcements'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Announcements
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
          
          {filteredDocuments.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center text-gray-500">
                            <i className={`fas fa-${getFileIcon(doc.fileType)} text-xl`}></i>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                            {doc.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">{doc.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getCategoryName(doc.category)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatFileSize(doc.fileSize)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(doc.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href={`/uploads/documents/${doc.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-gray-500">No documents found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default DocumentRepository; 