import React, { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPollById, reset } from '../../../features/polls/pollSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function PollDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { user } = useSelector((state) => state.auth);
  const { poll, isLoading, isError, message } = useSelector((state) => state.polls);
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      dispatch(getPollById(id));
    }
    
    return () => {
      dispatch(reset());
    };
  }, [user, id, navigate, dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No end date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
  
  const getChartData = (poll) => {
    const labels = poll.options.map(option => option.text);
    const data = poll.options.map(option => option.votes);
    
    // Generate colors
    const backgroundColors = [
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
      'rgba(83, 102, 255, 0.6)',
      'rgba(40, 159, 64, 0.6)',
      'rgba(210, 199, 199, 0.6)',
    ];
    
    const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));
    
    return {
      labels,
      datasets: [
        {
          label: 'Votes',
          data,
          backgroundColor: backgroundColors.slice(0, data.length),
          borderColor: borderColors.slice(0, data.length),
          borderWidth: 1,
        },
      ],
    };
  };
  
  if (isLoading || !poll) {
    return <Spinner />;
  }
  
  const { status, color } = getPollStatus(poll);
  const chartData = getChartData(poll);
  const totalVotes = poll.votes.length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Poll Results</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/admin/polls/edit/${poll._id}`)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Edit Poll
          </button>
          <button
            onClick={() => navigate('/admin/polls')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Back to Polls
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-semibold">{poll.title}</h2>
            <span className={`px-3 py-1 text-sm rounded-full ${color}`}>
              {status}
            </span>
          </div>
          
          {poll.description && (
            <p className="text-gray-600 mb-6">{poll.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Poll Information</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Created by:</span> {poll.createdBy?.name || 'Unknown'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Created on:</span> {formatDate(poll.createdAt)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">End date:</span> {formatDate(poll.endDate)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Total votes:</span> {totalVotes}
                </p>
              </div>
              
              <h3 className="text-lg font-semibold mt-6 mb-4">Results</h3>
              <div className="space-y-4">
                {poll.options.map((option, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">{option.text}</span>
                      <span className="text-gray-700">
                        {option.votes} vote{option.votes !== 1 ? 's' : ''} 
                        ({totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Chart</h3>
              <div className="h-64">
                {totalVotes > 0 ? (
                  <Pie data={chartData} options={{ maintainAspectRatio: false }} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No votes yet</p>
                  </div>
                )}
              </div>
              
              {poll.votes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Votes</h3>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Option
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {poll.votes.slice(0, 10).map((vote, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {vote.user?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {poll.options[vote.option]?.text || 'Unknown option'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(vote.votedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollDetail; 