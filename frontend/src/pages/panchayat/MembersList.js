import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchPanchayatMembers, 
  selectActiveMembers
} from '../../features/panchayatMembers/panchayatMembersSlice';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const MembersList = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectActiveMembers);
  const status = useSelector(state => state.panchayatMembers.status);
  const error = useSelector(state => state.panchayatMembers.error);
  
  useEffect(() => {
    dispatch(fetchPanchayatMembers());
  }, [dispatch]);
  
  if (status === 'loading') {
    return <Spinner />;
  }
  
  // Group members by position for better organization
  const groupedMembers = members.reduce((acc, member) => {
    if (!acc[member.position]) {
      acc[member.position] = [];
    }
    acc[member.position].push(member);
    return acc;
  }, {});
  
  // Sort positions by importance
  const positionOrder = ['Sarpanch', 'Deputy Sarpanch', 'Panch', 'Secretary', 'Other'];
  const sortedPositions = Object.keys(groupedMembers).sort((a, b) => {
    const indexA = positionOrder.indexOf(a) !== -1 ? positionOrder.indexOf(a) : 999;
    const indexB = positionOrder.indexOf(b) !== -1 ? positionOrder.indexOf(b) : 999;
    return indexA - indexB;
  });
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-6">Panchayat Members</h1>
          
          {members.length > 0 ? (
            <div className="space-y-10">
              {sortedPositions.map((position) => (
                <div key={position}>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">{position}s</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedMembers[position].map((member) => (
                      <Card key={member._id} hover className="h-full flex flex-col">
                        <div className="flex flex-col items-center p-6">
                          {member.image ? (
                            <div className="h-32 w-32 rounded-full overflow-hidden mb-4">
                              <img 
                                src={`/uploads/${member.image}`} 
                                alt={member.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                              <span className="text-4xl text-gray-500">{member.name.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                          
                          <Link to={`/panchayat/members/${member._id}`} className="block text-center">
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                              {member.name}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mb-4">{member.position}</p>
                          
                          <div className="mt-2 space-y-2 w-full">
                            <div className="flex items-center text-sm text-gray-500">
                              <PhoneIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              <a href={`tel:${member.contactNumber}`} className="hover:text-primary-600">
                                {member.contactNumber}
                              </a>
                            </div>
                            
                            {member.email && (
                              <div className="flex items-center text-sm text-gray-500">
                                <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                <a href={`mailto:${member.email}`} className="hover:text-primary-600">
                                  {member.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-auto p-4 text-center">
                          <Link 
                            to={`/panchayat/members/${member._id}`}
                            className="text-primary-600 hover:text-primary-800 font-medium"
                          >
                            View profile →
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">No panchayat members available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MembersList; 