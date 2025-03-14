import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getNewsById, createNews, updateNews, reset } from '../../../features/news/newsSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function NewsForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  const { singleNews, isLoading, isError, isSuccess, message } = useSelector((state) => state.news);
  
  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState('');
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    
    if (id) {
      setIsEdit(true);
      dispatch(getNewsById(id));
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
      toast.success('News created successfully');
      navigate('/admin/news');
    }
    
    if (isSuccess && isEdit && !isLoading) {
      toast.success('News updated successfully');
    }
  }, [isError, isSuccess, isEdit, isLoading, message, navigate]);
  
  const initialValues = {
    title: isEdit && singleNews ? singleNews.title : '',
    content: isEdit && singleNews ? singleNews.content : '',
    isPublished: isEdit && singleNews ? singleNews.isPublished : true,
    image: ''
  };
  
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required')
  });
  
  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('content', values.content);
    formData.append('isPublished', values.isPublished);
    
    if (fileInputRef.current.files[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }
    
    if (isEdit) {
      dispatch(updateNews({ id, newsData: formData }));
    } else {
      dispatch(createNews(formData));
    }
    
    setSubmitting(false);
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview('');
    }
  };
  
  if (isLoading || (isEdit && !singleNews)) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit News' : 'Create News'}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="News title"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
                <Field
                  as="textarea"
                  id="content"
                  name="content"
                  rows="6"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="News content"
                />
                <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 font-medium mb-2">Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
                
                {(preview || (isEdit && singleNews.image)) && (
                  <div className="mt-2">
                    <img 
                      src={preview || `/uploads/${singleNews.image}`} 
                      alt="Preview" 
                      className="h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    className="mr-2"
                  />
                  <label htmlFor="isPublished" className="text-gray-700">Publish immediately</label>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/admin/news')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update News' : 'Create News'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default NewsForm; 