import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPollById, votePoll, reset } from '../../features/polls/pollSlice';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { poll, isLoading, isError, isSuccess, message } = useSelector((state) => state.polls);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  
  useEffect(() => {
    dispatch(getPollById(id));
    
    return () => {
      dispatch(reset());
    };
  }, [id, dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    
    if (poll && user) {
      const userVoteRecord = poll.votes.find(vote => vote.user === user.id || vote.user?._id === user.id);
      if (userVoteRecord) {
        setHasVoted(true);
        setUserVote(userVoteRecord.option);
      }
    }
  }, [isError, message, poll, user]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No end date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const isPollActive = () => {
    if (!poll.isActive) return false;
    if (poll.endDate && new Date(poll.endDate) < new Date()) return false;
    return true;
  };
  
  const handleVote = () => {
    if (!user) {
      toast.error('Please login to vote');
      navigate('/login');
      return;
    }
    
    if (selectedOption === null) {
      toast.error('Please select an option');
      return;
    }
    
    dispatch(votePoll({ id, optionIndex: selectedOption }));
    setHasVoted(true);
    setUserVote(selectedOption);
    toast.success('Your vote has been recorded');
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
  
  const isActive = isPollActive();
  const totalVotes = poll.votes.length;
  const chartData = getChartData(poll);
  
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
            <h1 className="text-3xl font-bold">{poll.title}</h1>
            <Link
              to="/polls"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Back to Polls
            </Link>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              {poll.description && (
                <p className="text-gray-600 mb-6">{poll.description}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Poll Information</h3>
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-700">
                      <span className="font-medium">Created by:</span> {poll.createdBy?.name || 'Village Administration'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Created on:</span> {formatDate(poll.createdAt)}
                    </p>
                    {poll.endDate && (
                      <p className="text-gray-700">
                        <span className="font-medium">End date:</span> {formatDate(poll.endDate)}
                      </p>
                    )}
                    <p className="text-gray-700">
                      <span className="font-medium">Status:</span> {isActive ? 'Active' : 'Closed'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Total votes:</span> {totalVotes}
                    </p>
                  </div>
                  
                  {isActive && !hasVoted && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
                      <div className="space-y-2">
                        {poll.options.map((option, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="radio"
                              id={`option-${index}`}
                              name="poll-option"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                              checked={selectedOption === index}
                              onChange={() => setSelectedOption(index)}
                            />
                            <label htmlFor={`option-${index}`} className="ml-2 block text-gray-700">
                              {option.text}
                            </label>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleVote}
                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                        disabled={selectedOption === null}
                      >
                        Submit Vote
                      </button>
                    </div>
                  )}
                  
                  {hasVoted && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Your Vote</h3>
                      <p className="text-gray-700">
                        You voted for: <span className="font-medium">{poll.options[userVote]?.text}</span>
                      </p>
                    </div>
                  )}
                  
                  {!isActive && (
                    <div className="mb-6">
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                        <p>This poll is no longer active. You can view the results below.</p>
                      </div>
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold mb-4">Results</h3>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PollDetail; 