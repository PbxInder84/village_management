import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import userReducer from './features/users/userSlice';
import newsReducer from './features/news/newsSlice';
import eventReducer from './features/events/eventSlice';
import panchayatMembersReducer from './features/panchayatMembers/panchayatMembersSlice';
import serviceTypeReducer from './features/services/serviceTypeSlice';
import serviceRequestReducer from './features/services/serviceRequestSlice';
import galleryReducer from './features/gallery/gallerySlice';
import documentReducer from './features/documents/documentSlice';
import pollReducer from './features/polls/pollSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    news: newsReducer,
    events: eventReducer,
    panchayatMembers: panchayatMembersReducer,
    serviceTypes: serviceTypeReducer,
    serviceRequests: serviceRequestReducer,
    gallery: galleryReducer,
    documents: documentReducer,
    polls: pollReducer
  }
});

export default store; 