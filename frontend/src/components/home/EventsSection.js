import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import Button from '../ui/Button';

const EventsSection = ({ events }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Upcoming Events
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Join us for these upcoming village events and activities
          </p>
        </div>

        <motion.div 
          ref={ref}
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {events.length > 0 ? (
            events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  {event.image && (
                    <div className="h-48 w-full overflow-hidden rounded-t-lg">
                      <img 
                        src={`/uploads/${event.image}`} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex-grow p-6">
                    <Link to={`/events/${event._id}`} className="block">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
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
                    
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                  
                  <div className="px-6 pb-6">
                    <Button
                      to={`/events/${event._id}`}
                      variant="outline"
                      size="sm"
                      className="mt-4"
                    >
                      View Details →
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">No upcoming events at the moment.</p>
            </div>
          )}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Button to="/events" variant="primary">
            View All Events
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsSection; 