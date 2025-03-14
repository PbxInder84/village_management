import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllPolls, deletePoll, reset } from '../../../features/polls/pollSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';

function PollList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { polls, isLoading, isError, message } = useSelector((state) => state.polls);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      dispatch(getAllPolls());
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
    if (window.confirm('Are you sure you want to delete this poll?')) {
      dispatch(deletePoll(id));
      toast.success('Poll deleted successfully');
    }
  };
  
  const filteredPolls = polls.filter(
    (poll) => {
      const matchesSearch = 
        poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (poll.description && poll.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && poll.isActive && (!poll.endDate || new Date(poll.endDate) > new Date())) ||
        (statusFilter === 'inactive' && !poll.isActive) ||
        (statusFilter === 'ended' && poll.endDate && new Date(poll.endDate) < new Date());
      
      return matchesSearch && matchesStatus;
    }
  );
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No end date';
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getPollStatus = (poll) => {
    if (!poll.isActive) {
      return { status: 'Inactive', color: 'bg-gray-100 text-gray-800' };
    } else if (poll.endDate && new Date(poll.endDate) < new Date()) {
      return { status: 'Ended', color: 'bg-red-100 text-red-800' };
    } else {
      return { status: 'Active', color: 'bg-green-100 text-green-800' };
    }
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Polls and Surveys</h1>
        <button
          onClick={() => navigate('/admin/polls/add')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Create New Poll
        </button>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search polls..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-1/4">
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="ended">Ended</option>
          </select>
        </div>
      </div>
      
      {filteredPolls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => {
            const { status, color } = getPollStatus(poll);
            return (
              <div key={poll._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">{poll.title}</h2>
                    <span className={`px-2 py-1 text-xs rounded-full ${color}`}>
                      {status}
                    </span>
                  </div>
                  
                  {poll.description && (
                    <p className="text-gray-600 mb-4">{poll.description}</p>
                  )}
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Options:</span> {poll.options.length}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Votes:</span> {poll.votes.length}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">End Date:</span> {formatDate(poll.endDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Created:</span> {formatDate(poll.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => navigate(`/admin/polls/edit/${poll._id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/admin/polls/${poll._id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Results
                    </button>
                    <button
                      onClick={() => handleDelete(poll._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No polls found.</p>
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

export default PollList; 