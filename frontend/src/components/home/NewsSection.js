import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Card from '../ui/Card';
import Button from '../ui/Button';

const NewsSection = ({ news }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Latest News & Announcements
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Stay updated with the latest happenings in our village
          </p>
        </div>

        <motion.div 
          ref={ref}
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {news.length > 0 ? (
            news.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  {item.image && (
                    <div className="h-48 w-full overflow-hidden rounded-t-lg">
                      <img 
                        src={`/uploads/${item.image}`} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex-grow p-6">
                    <p className="text-sm font-medium text-primary-600">
                      {formatDate(item.createdAt)}
                    </p>
                    <Link to={`/news/${item._id}`} className="block mt-2">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">
                        {item.content}
                      </p>
                    </Link>
                  </div>
                  <div className="px-6 pb-6">
                    <Button
                      to={`/news/${item._id}`}
                      variant="outline"
                      size="sm"
                      className="mt-4"
                    >
                      Read more →
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500">No news available at the moment.</p>
            </div>
          )}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Button to="/news" variant="primary">
            View All News
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsSection; 