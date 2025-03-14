import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <h2 className="text-6xl font-extrabold text-primary-600 mb-6">404</h2>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Button to="/" variant="primary" size="lg">
              Go back home
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound; 