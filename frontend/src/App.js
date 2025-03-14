import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Auth Components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Components
import AdminDashboard from './pages/admin/Dashboard';
import UserList from './pages/admin/users/UserList';
import UserForm from './pages/admin/users/UserForm';
import NewsList from './pages/admin/news/NewsList';
import NewsForm from './pages/admin/news/NewsForm';
import EventList from './pages/admin/events/EventList';
import EventForm from './pages/admin/events/EventForm';
import MemberList from './pages/admin/panchayat/MemberList';
import MemberForm from './pages/admin/panchayat/MemberForm';
import ServiceTypeList from './pages/admin/services/ServiceTypeList';
import ServiceTypeForm from './pages/admin/services/ServiceTypeForm';
import ServiceRequestList from './pages/admin/services/ServiceRequestList';
import ServiceRequestDetail from './pages/admin/services/ServiceRequestDetail';
import GalleryList from './pages/admin/gallery/GalleryList';
import GalleryForm from './pages/admin/gallery/GalleryForm';
import DocumentList from './pages/admin/documents/DocumentList';
import DocumentForm from './pages/admin/documents/DocumentForm';
import PollList from './pages/admin/polls/PollList';
import PollForm from './pages/admin/polls/PollForm';
import PollDetail from './pages/admin/polls/PollDetail';

// Public Components
import Home from './pages/Home';
import PublicNewsList from './pages/news/NewsList';
import NewsDetail from './pages/news/NewsDetail';
import PublicEventsList from './pages/events/EventsList';
import EventDetail from './pages/events/EventDetail';
import MemberDetail from './pages/panchayat/MemberDetail';
import ServiceRequestForm from './pages/services/ServiceRequestForm';
import UserRequestList from './pages/services/UserRequestList';
import UserRequestDetail from './pages/services/UserRequestDetail';
import Gallery from './pages/gallery/Gallery';
import GalleryDetail from './pages/gallery/GalleryDetail';
import DocumentRepository from './pages/documents/DocumentRepository';
import PublicPollList from './pages/polls/PollList';
import PublicPollDetail from './pages/polls/PollDetail';
import NotFound from './pages/NotFound';
import MembersList from './pages/panchayat/MembersList';
import PanchayatMembers from './components/PanchayatMembers';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* News Routes */}
          <Route path="/news" element={<PublicNewsList />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          
          {/* Events Routes */}
          <Route path="/events" element={<PublicEventsList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          
          <Route path="/panchayat/members/:id" element={<MemberDetail />} />
          
          {/* Service Request Routes */}
          <Route path="/services/requests" element={<UserRequestList />} />
          <Route path="/services/requests/new" element={<ServiceRequestForm />} />
          <Route path="/services/requests/:id" element={<UserRequestDetail />} />
          
          {/* Gallery Routes */}
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<GalleryDetail />} />
          
          {/* Document Routes */}
          <Route path="/documents" element={<DocumentRepository />} />
          
          {/* Poll Routes */}
          <Route path="/polls" element={<PublicPollList />} />
          <Route path="/polls/:id" element={<PublicPollDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* User Management Routes */}
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/add" element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/edit/:id" element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          } />
          
          {/* News Management Routes */}
          <Route path="/admin/news" element={
            <ProtectedRoute>
              <NewsList />
            </ProtectedRoute>
          } />
          <Route path="/admin/news/add" element={
            <ProtectedRoute>
              <NewsForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/news/edit/:id" element={
            <ProtectedRoute>
              <NewsForm />
            </ProtectedRoute>
          } />
          
          {/* Event Management Routes */}
          <Route path="/admin/events" element={
            <ProtectedRoute>
              <EventList />
            </ProtectedRoute>
          } />
          <Route path="/admin/events/add" element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/events/edit/:id" element={
            <ProtectedRoute>
              <EventForm />
            </ProtectedRoute>
          } />
          
          {/* Panchayat Management Routes */}
          <Route path="/admin/panchayat/members" element={
            <ProtectedRoute>
              <MemberList />
            </ProtectedRoute>
          } />
          <Route path="/admin/panchayat/members/add" element={<MemberForm />} />
          <Route path="/admin/panchayat/members/edit/:id" element={<MemberForm />} />
          
          {/* Service Management Routes */}
          <Route path="/admin/services/types" element={
            <ProtectedRoute>
              <ServiceTypeList />
            </ProtectedRoute>
          } />
          <Route path="/admin/services/types/add" element={
            <ProtectedRoute>
              <ServiceTypeForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/services/types/edit/:id" element={
            <ProtectedRoute>
              <ServiceTypeForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/services/requests" element={
            <ProtectedRoute>
              <ServiceRequestList />
            </ProtectedRoute>
          } />
          <Route path="/admin/services/requests/:id" element={
            <ProtectedRoute>
              <ServiceRequestDetail />
            </ProtectedRoute>
          } />
          
          {/* Gallery Management Routes */}
          <Route path="/admin/gallery" element={
            <ProtectedRoute>
              <GalleryList />
            </ProtectedRoute>
          } />
          <Route path="/admin/gallery/add" element={
            <ProtectedRoute>
              <GalleryForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/gallery/edit/:id" element={
            <ProtectedRoute>
              <GalleryForm />
            </ProtectedRoute>
          } />
          
          {/* Document Management Routes */}
          <Route path="/admin/documents" element={
            <ProtectedRoute>
              <DocumentList />
            </ProtectedRoute>
          } />
          <Route path="/admin/documents/add" element={
            <ProtectedRoute>
              <DocumentForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/documents/edit/:id" element={
            <ProtectedRoute>
              <DocumentForm />
            </ProtectedRoute>
          } />
          
          {/* Poll Management Routes */}
          <Route path="/admin/polls" element={
            <ProtectedRoute>
              <PollList />
            </ProtectedRoute>
          } />
          <Route path="/admin/polls/add" element={
            <ProtectedRoute>
              <PollForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/polls/edit/:id" element={
            <ProtectedRoute>
              <PollForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/polls/:id" element={
            <ProtectedRoute>
              <PollDetail />
            </ProtectedRoute>
          } />
          
          {/* Panchayat Members Route */}
          <Route path="/panchayat/members" element={<MembersList />} />
          
          {/* Panchayat Route */}
          <Route path="/panchayat" element={<PanchayatMembers />} />
          
          {/* Forgot Password Route */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Reset Password Route */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
