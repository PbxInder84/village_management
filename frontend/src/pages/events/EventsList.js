import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPublishedEvents } from '../../features/events/eventSlice';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const EventsList = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.events);
  
  useEffect(() => {
    dispatch(getPublishedEvents());
  }, [dispatch]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  // Sort events by date (upcoming first)
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Separate upcoming and past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = sortedEvents.filter(event => new Date(event.date) >= today);
  const pastEvents = sortedEvents.filter(event => new Date(event.date) < today);
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-6">Events Calendar</h1>
          
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {upcomingEvents.map((event) => (
                <Card key={event._id} hover className="h-full flex flex-col">
                  {event.image && (
                    <div className="h-48 w-full overflow-hidden">
                      <img 
                        src={`/uploads/${event.image}`} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-grow">
                    <Link to={`/events/${event._id}`} className="block">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2">
                        {event.title}
                      </h3>
                    </Link>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {formatDate(event.date)}
                      </div>
                      
                      {event.time && (
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {formatTime(event.time)}
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-3 text-gray-600 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                  <div className="px-6 pb-6">
                    <Link 
                      to={`/events/${event._id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium"
                    >
                      View details →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center mb-10">
              <p className="text-gray-500">No upcoming events at the moment.</p>
            </div>
          )}
          
          <h2 className="text-2xl font-semibold mb-4">Past Events</h2>
          {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card key={event._id} hover className="h-full flex flex-col bg-gray-50">
                  {event.image && (
                    <div className="h-48 w-full overflow-hidden opacity-75">
                      <img 
                        src={`/uploads/${event.image}`} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-grow">
                    <div className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded mb-2">
                      Past Event
                    </div>
                    <Link to={`/events/${event._id}`} className="block">
                      <h3 className="text-xl font-semibold text-gray-700 hover:text-primary-600 transition-colors mb-2">
                        {event.title}
                      </h3>
                    </Link>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {formatDate(event.date)}
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Link 
                      to={`/events/${event._id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium"
                    >
                      View details →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">No past events available.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EventsList; 