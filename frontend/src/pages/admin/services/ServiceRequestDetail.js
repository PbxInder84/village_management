import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getRequestById, updateRequestStatus, addComment, reset } from '../../../features/services/serviceRequestSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';

function ServiceRequestDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { user } = useSelector((state) => state.auth);
  const { request, isLoading, isError, isSuccess, message } = useSelector((state) => state.serviceRequests);
  
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      dispatch(getRequestById(id));
    }
    
    return () => {
      dispatch(reset());
    };
  }, [user, id, navigate, dispatch]);
  
  useEffect(() => {
    if (request) {
      setStatus(request.status);
    }
  }, [request]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };
  
  const handleUpdateStatus = () => {
    dispatch(updateRequestStatus({ 
      id, 
      statusData: { 
        status,
        assignedTo: user.id
      } 
    }));
    toast.success('Status updated successfully');
  };
  
  const handleAddComment = (e) => {
    e.preventDefault();
    
    if (comment.trim() === '') {
      toast.error('Comment cannot be empty');
      return;
    }
    
    dispatch(addComment({
      id,
      commentData: { text: comment }
    }));
    
    setComment('');
    toast.success('Comment added successfully');
  };
  
  if (isLoading || !request) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Service Request Details</h1>
        <button
          onClick={() => navigate('/admin/services/requests')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Back to Requests
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{request.service}</h2>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
              ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                request.status === 'completed' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'}`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Submitted on {formatDate(request.createdAt)}
          </p>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Applicant Information</h3>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Name:</span> {request.applicant && request.applicant.name ? request.applicant.name : 'N/A'}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Contact:</span> {request.contactNumber}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Address:</span> {request.address}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Request Details</h3>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Service:</span> {request.service}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Assigned To:</span> {request.assignedTo && request.assignedTo.name ? request.assignedTo.name : 'Not assigned'}
              </p>
              <p className="mt-1 text-sm text-gray-900">
                <span className="font-medium">Last Updated:</span> {formatDate(request.updatedAt)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
          <p className="text-sm text-gray-900 whitespace-pre-line">{request.description}</p>
        </div>
        
        {request.attachments && request.attachments.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Attachments</h3>
            <div className="flex flex-wrap gap-2">
              {request.attachments.map((attachment, index) => (
                <a 
                  key={index}
                  href={`/uploads/${attachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                  Attachment {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
          <div className="flex items-center">
            <select
              value={status}
              onChange={handleStatusChange}
              className="mr-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={handleUpdateStatus}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Update Status
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Comments</h3>
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
            {request.comments && request.comments.length > 0 ? (
              request.comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm text-gray-900">
                      {comment.user && comment.user.name ? comment.user.name : 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-800">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
          
          <form onSubmit={handleAddComment} className="mt-4">
            <div className="flex">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ServiceRequestDetail; 