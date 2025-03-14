import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMemberById, reset } from '../../features/panchayat/panchayatMemberSlice';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';

function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { member, isLoading, isError, message } = useSelector((state) => state.panchayatMembers);
  
  useEffect(() => {
    dispatch(getMemberById(id));
    
    return () => {
      dispatch(reset());
    };
  }, [id, dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
      navigate('/');
    }
  }, [isError, message, navigate]);
  
  if (isLoading || !member) {
    return <Spinner />;
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
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
              {user && (
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
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                {member.image ? (
                  <img 
                    src={`/uploads/${member.image}`} 
                    alt={member.name} 
                    className="h-48 w-full object-cover md:w-48"
                  />
                ) : (
                  <div className="h-48 w-full md:w-48 bg-gray-200 flex items-center justify-center">
                    <svg className="h-24 w-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {member.position}
                </div>
                <h2 className="mt-1 text-3xl font-bold text-gray-900">{member.name}</h2>
                
                <div className="mt-4 text-gray-600">
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2a1 1 0 011-1h8a1 1 0 011 1zM9 5v4h2V5H9z" clipRule="evenodd" />
                    </svg>
                    <span>Term: {formatDate(member.termStart)} - {formatDate(member.termEnd)}</span>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{member.contactNumber}</span>
                  </div>
                  
                  {member.email && (
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{member.email}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center mb-2">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{member.address}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className={member.isActive ? 'text-green-600' : 'text-red-600'}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {member.bio && (
              <div className="px-8 py-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Biography</h3>
                <div className="prose max-w-none">
                  {member.bio.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between">
                <button
                  onClick={() => navigate('/')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Back to Home
                </button>
                
                {user && user.role === 'admin' && (
                  <button
                    onClick={() => navigate(`/admin/panchayat/members/edit/${member._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit Member
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MemberDetail; 