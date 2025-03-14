import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
  { id: 1, name: 'Residents', value: '5,000+' },
  { id: 2, name: 'Service Requests Processed', value: '1,200+' },
  { id: 3, name: 'Documents Available', value: '500+' },
  { id: 4, name: 'Events Organized', value: '100+' },
];

const StatsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-primary-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Trusted by the entire Upalheri community
          </h2>
          <p className="mt-3 text-xl text-primary-200 sm:mt-4">
            Our platform connects residents, streamlines services, and enhances community engagement.
          </p>
        </div>
        <motion.dl 
          ref={ref}
          className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-2 sm:gap-8 lg:max-w-none lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col mt-10 sm:mt-0"
            >
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                {stat.name}
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </div>
  );
};

export default StatsSection; 