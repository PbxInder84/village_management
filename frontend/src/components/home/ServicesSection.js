import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Button from '../ui/Button';

const services = [
  {
    name: 'Birth Certificate',
    description: 'Apply for a birth certificate for newborns in the village.',
    icon: '👶',
  },
  {
    name: 'Death Certificate',
    description: 'Request a death certificate for deceased residents.',
    icon: '📜',
  },
  {
    name: 'Income Certificate',
    description: 'Apply for an income certificate for financial purposes.',
    icon: '💰',
  },
  {
    name: 'Residence Certificate',
    description: 'Get a certificate proving your residence in the village.',
    icon: '🏠',
  },
  {
    name: 'Property Tax Payment',
    description: 'Pay your property tax online through our secure system.',
    icon: '💸',
  },
  {
    name: 'Water Connection',
    description: 'Apply for a new water connection or report issues with existing ones.',
    icon: '💧',
  },
];

const ServicesSection = ({ user }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Village Services
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Access a wide range of services provided by the village administration
          </p>
        </div>

        <motion.div 
          ref={ref}
          className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
              <p className="mt-2 text-base text-gray-500">{service.description}</p>
              <div className="mt-4">
                <Button
                  to={user ? "/services/requests/new" : "/login"}
                  variant="outline"
                  size="sm"
                >
                  {user ? "Request Service" : "Login to Request"}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Button to="/services/requests/new" variant="primary">
            Request a Service
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection; 