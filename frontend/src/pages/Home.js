import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { getPublishedNews } from '../features/news/newsSlice';
import { getPublishedEvents } from '../features/events/eventSlice';
import { getActiveMembers } from '../features/panchayat/panchayatMemberSlice';
import Spinner from '../components/common/Spinner';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import FeatureSection from '../components/home/FeatureSection';
import StatsSection from '../components/home/StatsSection';
import NewsSection from '../components/home/NewsSection';
import EventsSection from '../components/home/EventsSection';
import ServicesSection from '../components/home/ServicesSection';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { news, isLoading: newsLoading } = useSelector((state) => state.news);
  const { events, isLoading: eventsLoading } = useSelector((state) => state.events);
  const { members, isLoading: membersLoading } = useSelector((state) => state.panchayatMembers);
  
  useEffect(() => {
    dispatch(getPublishedNews());
    dispatch(getPublishedEvents());
    dispatch(getActiveMembers());
  }, [dispatch]);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (newsLoading || eventsLoading || membersLoading) {
    return <Spinner />;
  }
  
  // Sort events by date (upcoming first)
  const upcomingEvents = [...events]
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);
  
  // Get latest news
  const latestNews = [...news]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  
  return (
    <Layout>
      <Hero user={user} />
      <FeatureSection />
      <StatsSection />
      <NewsSection news={latestNews} />
      <EventsSection events={upcomingEvents} />
      <ServicesSection user={user} />
    </Layout>
  );
}

export default Home; 