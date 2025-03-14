import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEventById, createEvent, updateEvent, reset } from '../../../features/events/eventSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function EventForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  const { singleEvent, isLoading, isError, isSuccess, message } = useSelector((state) => state.events);
  
  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState('');
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    
    if (id) {
      setIsEdit(true);
      dispatch(getEventById(id));
    }
    
    return () => {
      dispatch(reset());
    };
  }, [user, id, navigate, dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    
    if (isSuccess && !isEdit) {
      toast.success('Event created successfully');
      navigate('/admin/events');
    }
    
    if (isSuccess && isEdit) {
      toast.success('Event updated successfully');
    }
  }, [isError, isSuccess, message, isEdit, navigate]);
  
  const initialValues = {
    title: isEdit && singleEvent ? singleEvent.title : '',
    description: isEdit && singleEvent ? singleEvent.description : '',
    date: isEdit && singleEvent ? singleEvent.date.substring(0, 10) : '',
    time: isEdit && singleEvent ? singleEvent.time : '',
    location: isEdit && singleEvent ? singleEvent.location : '',
    isPublished: isEdit && singleEvent ? singleEvent.isPublished : true
  };
  
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    location: Yup.string().required('Location is required')
  });
  
  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('date', values.date);
    formData.append('time', values.time);
    formData.append('location', values.location);
    formData.append('isPublished', values.isPublished);
    
    if (fileInputRef.current.files[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }
    
    if (isEdit) {
      dispatch(updateEvent({ id, eventData: formData }));
    } else {
      dispatch(createEvent(formData));
    }
    
    setSubmitting(false);
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  if (isLoading || (isEdit && !singleEvent)) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Event' : 'Create Event'}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event title"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="6"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event description"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Date</label>
                  <Field
                    type="date"
                    id="date"
                    name="date"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="date" component="div" className="text-red-500 mt-1" />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-gray-700 font-medium mb-2">Time</label>
                  <Field
                    type="time"
                    id="time"
                    name="time"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="time" component="div" className="text-red-500 mt-1" />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Location</label>
                <Field
                  type="text"
                  id="location"
                  name="location"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Event location"
                />
                <ErrorMessage name="location" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Event Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
                {(preview || (isEdit && singleEvent && singleEvent.image)) && (
                  <div className="mt-2">
                    <img
                      src={preview || `/uploads/${singleEvent.image}`}
                      alt="Event preview"
                      className="w-full max-h-64 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <Field
                    type="checkbox"
                    name="isPublished"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Publish this event</span>
                </label>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/admin/events')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EventForm; 