import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createRequest, reset } from '../../features/services/serviceRequestSlice';
import { getActiveServiceTypes } from '../../features/services/serviceTypeSlice';
import Spinner from '../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ServiceRequestForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  const { isLoading: requestLoading, isError: requestError, isSuccess: requestSuccess, message: requestMessage } = useSelector((state) => state.serviceRequests);
  const { serviceTypes, isLoading: typesLoading, isError: typesError, message: typesMessage } = useSelector((state) => state.serviceTypes);
  
  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreview] = useState([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getActiveServiceTypes());
    }
    
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);
  
  useEffect(() => {
    if (requestError) {
      toast.error(requestMessage);
    }
    
    if (typesError) {
      toast.error(typesMessage);
    }
    
    if (requestSuccess) {
      toast.success('Service request submitted successfully');
      navigate('/services/requests');
    }
  }, [requestError, typesError, requestSuccess, requestMessage, typesMessage, navigate]);
  
  const initialValues = {
    service: '',
    description: '',
    contactNumber: user ? user.phone || '' : '',
    address: ''
  };
  
  const validationSchema = Yup.object({
    service: Yup.string().required('Service type is required'),
    description: Yup.string().required('Description is required'),
    contactNumber: Yup.string().required('Contact number is required'),
    address: Yup.string().required('Address is required')
  });
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    
    // Create preview URLs
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setFilePreview(previews);
  };
  
  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    
    formData.append('service', values.service);
    formData.append('description', values.description);
    formData.append('contactNumber', values.contactNumber);
    formData.append('address', values.address);
    
    // Append files if any
    files.forEach(file => {
      formData.append('attachments', file);
    });
    
    dispatch(createRequest(formData));
    setSubmitting(false);
  };
  
  if (requestLoading || typesLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Village Management System</h1>
              </div>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="flex items-center space-x-4">
                  {user.role === 'admin' && (
                    <button 
                      onClick={() => navigate('/admin')}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button 
                    onClick={() => navigate('/')}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Home
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold mb-6">Request a Service</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="service" className="block text-gray-700 font-medium mb-2">Service Type</label>
                    <Field
                      as="select"
                      id="service"
                      name="service"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a service</option>
                      {serviceTypes.map(type => (
                        <option key={type._id} value={type.name}>{type.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="service" component="div" className="text-red-500 mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please describe your request in detail"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="contactNumber" className="block text-gray-700 font-medium mb-2">Contact Number</label>
                    <Field
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your contact number"
                    />
                    <ErrorMessage name="contactNumber" component="div" className="text-red-500 mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your address"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 mt-1" />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Attachments (Optional)</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept="image/*,.pdf,.doc,.docx"
                      multiple
                    />
                    <p className="text-sm text-gray-500 mt-1">You can upload up to 5 files (images, PDFs, or documents)</p>
                    
                    {filePreview.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {filePreview.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="h-20 w-20 object-cover rounded border"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ServiceRequestForm; 