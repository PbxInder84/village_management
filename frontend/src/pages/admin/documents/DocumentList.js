import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllDocuments, deleteDocument, reset } from '../../../features/documents/documentSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';

function DocumentList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { documents, isLoading, isError, message } = useSelector((state) => state.documents);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      dispatch(getAllDocuments());
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
    if (window.confirm('Are you sure you want to delete this document?')) {
      dispatch(deleteDocument(id));
      toast.success('Document deleted successfully');
    }
  };
  
  const filteredDocuments = documents.filter(
    (doc) => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    }
  );
  
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
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Document Repository</h1>
        <button
          onClick={() => navigate('/admin/documents/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Upload New Document
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
            <option value="meeting_minutes">Meeting Minutes</option>
            <option value="budgets">Budgets</option>
            <option value="policies">Policies</option>
            <option value="forms">Forms</option>
            <option value="reports">Reports</option>
            <option value="announcements">Announcements</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
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
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
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
                    <div className="text-sm text-gray-500">
                      {doc.uploadedBy && doc.uploadedBy.name ? `by ${doc.uploadedBy.name}` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      doc.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doc.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <a
                        href={`/uploads/documents/${doc.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => navigate(`/admin/documents/edit/${doc._id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No documents found.
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

export default DocumentList; 