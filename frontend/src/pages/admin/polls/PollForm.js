import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPollById, createPoll, updatePoll, reset } from '../../../features/polls/pollSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';

function PollForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { user } = useSelector((state) => state.auth);
  const { poll, isLoading, isError, isSuccess, message } = useSelector((state) => state.polls);
  
  const [isEdit, setIsEdit] = useState(false);
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    
    if (id) {
      setIsEdit(true);
      dispatch(getPollById(id));
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
      toast.success('Poll created successfully');
      navigate('/admin/polls');
    }
    
    if (isSuccess && isEdit) {
      toast.success('Poll updated successfully');
    }
  }, [isError, isSuccess, message, isEdit, navigate]);
  
  const initialValues = {
    title: isEdit && poll ? poll.title : '',
    description: isEdit && poll ? poll.description : '',
    options: isEdit && poll && poll.options ? poll.options.map(option => option.text) : ['', ''],
    endDate: isEdit && poll && poll.endDate ? new Date(poll.endDate).toISOString().split('T')[0] : '',
    isActive: isEdit && poll ? poll.isActive : true
  };
  
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    options: Yup.array()
      .of(Yup.string().required('Option text is required'))
      .min(2, 'At least two options are required')
  });
  
  const handleSubmit = (values, { setSubmitting }) => {
    const pollData = {
      title: values.title,
      description: values.description,
      options: values.options.filter(option => option.trim() !== ''),
      endDate: values.endDate || null,
      isActive: values.isActive
    };
    
    if (isEdit) {
      dispatch(updatePoll({ id, pollData }));
    } else {
      dispatch(createPoll(pollData));
    }
    
    setSubmitting(false);
  };
  
  if (isLoading || (isEdit && !poll)) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Edit Poll' : 'Create New Poll'}
        </h1>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, isSubmitting, errors, touched }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title *</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter poll title"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter poll description"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Options *</label>
                <FieldArray name="options">
                  {({ remove, push }) => (
                    <div>
                      {values.options.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <Field
                            name={`options.${index}`}
                            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${index + 1}`}
                          />
                          {values.options.length > 2 && (
                            <button
                              type="button"
                              className="ml-2 text-red-600 hover:text-red-800"
                              onClick={() => remove(index)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      ))}
                      <ErrorMessage
                        name="options"
                        component="div"
                        className="text-red-500 mt-1"
                      />
                      <button
                        type="button"
                        className="mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                        onClick={() => push('')}
                      >
                        Add Option
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
              
              <div className="mb-4">
                <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">End Date</label>
                <Field
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Leave blank for no end date</p>
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <Field
                    type="checkbox"
                    name="isActive"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Inactive polls are not visible to users
                </p>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/admin/polls')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded text-white ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Poll' : 'Create Poll'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default PollForm; 