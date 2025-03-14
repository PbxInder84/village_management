import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getServiceTypeById, createServiceType, updateServiceType, reset } from '../../../features/services/serviceTypeSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';

function ServiceTypeForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { user } = useSelector((state) => state.auth);
  const { serviceType, isLoading, isError, isSuccess, message } = useSelector((state) => state.serviceTypes);
  
  const [isEdit, setIsEdit] = useState(false);
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    
    if (id) {
      setIsEdit(true);
      dispatch(getServiceTypeById(id));
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
      toast.success('Service type created successfully');
      navigate('/admin/services/types');
    }
    
    if (isSuccess && isEdit) {
      toast.success('Service type updated successfully');
    }
  }, [isError, isSuccess, message, isEdit, navigate]);
  
  const initialValues = {
    name: isEdit && serviceType ? serviceType.name : '',
    description: isEdit && serviceType ? serviceType.description : '',
    department: isEdit && serviceType ? serviceType.department : '',
    requiredDocuments: isEdit && serviceType && serviceType.requiredDocuments ? 
      serviceType.requiredDocuments : [''],
    isActive: isEdit && serviceType ? serviceType.isActive : true
  };
  
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    department: Yup.string().required('Department is required'),
    requiredDocuments: Yup.array().of(
      Yup.string()
    )
  });
  
  const handleSubmit = (values, { setSubmitting }) => {
    // Filter out empty document entries
    const filteredDocuments = values.requiredDocuments.filter(doc => doc.trim() !== '');
    
    const serviceTypeData = {
      ...values,
      requiredDocuments: filteredDocuments.join(',')
    };
    
    if (isEdit) {
      dispatch(updateServiceType({ id, serviceTypeData }));
    } else {
      dispatch(createServiceType(serviceTypeData));
    }
    
    setSubmitting(false);
  };
  
  if (isLoading || (isEdit && !serviceType)) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Service Type' : 'Create Service Type'}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Service type name"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="department" className="block text-gray-700 font-medium mb-2">Department</label>
                <Field
                  type="text"
                  id="department"
                  name="department"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Responsible department"
                />
                <ErrorMessage name="department" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Service description"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Required Documents</label>
                <FieldArray name="requiredDocuments">
                  {({ remove, push }) => (
                    <div>
                      {values.requiredDocuments.map((document, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <Field
                            name={`requiredDocuments.${index}`}
                            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Document name"
                          />
                          <button
                            type="button"
                            className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                            onClick={() => remove(index)}
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => push('')}
                      >
                        Add Document
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <Field
                    type="checkbox"
                    name="isActive"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Active Service</span>
                </label>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/admin/services/types')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Service Type' : 'Create Service Type'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ServiceTypeForm; 