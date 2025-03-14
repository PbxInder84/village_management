import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPublishedNews } from '../../features/news/newsSlice';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/common/Spinner';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';

const NewsList = () => {
  const dispatch = useDispatch();
  const { news, isLoading } = useSelector((state) => state.news);
  
  useEffect(() => {
    dispatch(getPublishedNews());
  }, [dispatch]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-6">News & Announcements</h1>
          
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Card key={item._id} hover className="h-full flex flex-col">
                  {item.image && (
                    <div className="h-48 w-full overflow-hidden">
                      <img 
                        src={`/uploads/${item.image}`} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-grow">
                    <p className="text-sm text-gray-500 mb-2">{formatDate(item.createdAt)}</p>
                    <Link to={`/news/${item._id}`} className="block">
                      <h2 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2">
                        {item.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 line-clamp-3">{item.content}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <Link 
                      to={`/news/${item._id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-500">No news available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default NewsList; 