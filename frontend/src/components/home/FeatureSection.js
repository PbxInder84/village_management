import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  DocumentTextIcon, 
  CalendarIcon, 
  NewspaperIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  PhotoIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const features = [
  {
    name: 'News & Announcements',
    description: 'Stay updated with the latest news and announcements from the village administration.',
    icon: NewspaperIcon,
    link: '/news'
  },
  {
    name: 'Events Calendar',
    description: 'View upcoming events, festivals, and meetings happening in the village.',
    icon: CalendarIcon,
    link: '/events'
  },
  {
    name: 'Service Requests',
    description: 'Submit and track requests for various services provided by the village administration.',
    icon: DocumentTextIcon,
    link: '/services/requests'
  },
  {
    name: 'Panchayat Members',
    description: 'Get to know your elected representatives and their responsibilities.',
    icon: UserGroupIcon,
    link: '/panchayat/members'
  },
  {
    name: 'Document Repository',
    description: 'Access important documents, forms, and policies related to the village.',
    icon: DocumentTextIcon,
    link: '/documents'
  },
  {
    name: 'Polls & Surveys',
    description: 'Participate in polls and surveys to share your opinion on village matters.',
    icon: ChartBarIcon,
    link: '/polls'
  },
  {
    name: 'Photo Gallery',
    description: 'Browse through photos of village events, landmarks, and activities.',
    icon: PhotoIcon,
    link: '/gallery'
  }
];

const FeatureSection = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need in one place
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our Village Management System provides a comprehensive set of features to connect residents with the administration and services.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <FeatureItem key={feature.name} feature={feature} index={index} />
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      <Link to={feature.link} className="group block">
        <dt>
          <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white group-hover:bg-primary-600 transition-colors">
            <feature.icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="ml-16 text-lg leading-6 font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{feature.name}</p>
        </dt>
        <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
      </Link>
    </motion.div>
  );
};

export default FeatureSection; 