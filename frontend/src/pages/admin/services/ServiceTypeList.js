import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllServiceTypes, deleteServiceType, reset } from '../../../features/services/serviceTypeSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';

function ServiceTypeList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { serviceTypes, isLoading, isError, message } = useSelector((state) => state.serviceTypes);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      dispatch(getAllServiceTypes());
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
    if (window.confirm('Are you sure you want to delete this service type?')) {
      dispatch(deleteServiceType(id));
      toast.success('Service type deleted successfully');
    }
  };
  
  const filteredServiceTypes = serviceTypes.filter(
    (type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Service Types</h1>
        <button
          onClick={() => navigate('/admin/services/types/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Add Service Type
        </button>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search service types by name or department..."
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
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Required Documents
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
            {filteredServiceTypes.length > 0 ? (
              filteredServiceTypes.map((type) => (
                <tr key={type._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{type.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{type.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {type.requiredDocuments && type.requiredDocuments.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {type.requiredDocuments.map((doc, index) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      type.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {type.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => navigate(`/admin/services/types/edit/${type._id}`)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(type._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No service types found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button 
          onClick={() => navigate('/admin')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Back to Dashboard
        </button>
        
        <button 
          onClick={() => navigate('/admin/services/requests')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Manage Service Requests
        </button>
      </div>
    </div>
  );
}

export default ServiceTypeList; 