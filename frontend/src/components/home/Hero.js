import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const Hero = ({ user }) => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
              >
                <span className="block xl:inline">Welcome to Upalheri</span>{' '}
                <span className="block text-primary-600 xl:inline">Village Management System</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
              >
                A comprehensive digital platform connecting residents with village administration and services. 
                Stay updated with news, events, and access essential services online.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
              >
                {!user ? (
                  <>
                    <div className="rounded-md shadow">
                      <Button
                        to="/register"
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        Get Started
                      </Button>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Button
                        to="/login"
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        Log In
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-md shadow">
                      <Button
                        to="/services/requests/new"
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        Request a Service
                      </Button>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Button
                        to="/services/requests"
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        My Requests
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="/images/village-hero.jpg"
          alt="Upalheri Village"
        />
      </div>
    </div>
  );
};

export default Hero; 