import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDocumentById, uploadDocument, updateDocument, reset } from '../../../features/documents/documentSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function DocumentForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  const { document, isLoading, isError, isSuccess, message } = useSelector((state) => state.documents);
  
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    
    if (id) {
      setIsEdit(true);
      dispatch(getDocumentById(id));
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
      toast.success('Document uploaded successfully');
      navigate('/admin/documents');
    }
    
    if (isSuccess && isEdit) {
      toast.success('Document updated successfully');
    }
    
    if (isEdit && document && document.file) {
      setFileName(document.file.split('_').pop());
    }
  }, [isError, isSuccess, message, isEdit, navigate, document]);
  
  const initialValues = {
    title: isEdit && document ? document.title : '',
    description: isEdit && document ? document.description : '',
    category: isEdit && document ? document.category : 'meeting_minutes',
    tags: isEdit && document && document.tags ? document.tags.join(', ') : '',
    isPublic: isEdit && document ? document.isPublic : true
  };
  
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    category: Yup.string().required('Category is required')
  });
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };
  
  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('category', values.category);
    formData.append('tags', values.tags || '');
    formData.append('isPublic', values.isPublic);
    
    if (selectedFile) {
      formData.append('file', selectedFile);
    }
    
    if (isEdit) {
      dispatch(updateDocument({ id, documentData: formData }));
    } else {
      dispatch(uploadDocument(formData));
    }
    
    setSubmitting(false);
  };
  
  if (isLoading || (isEdit && !document)) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Edit Document' : 'Upload New Document'}
        </h1>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title *</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter document title"
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
                  placeholder="Enter document description"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category *</label>
                <Field
                  as="select"
                  id="category"
                  name="category"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="meeting_minutes">Meeting Minutes</option>
                  <option value="budgets">Budgets</option>
                  <option value="policies">Policies</option>
                  <option value="forms">Forms</option>
                  <option value="reports">Reports</option>
                  <option value="announcements">Announcements</option>
                  <option value="other">Other</option>
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">Tags</label>
                <Field
                  type="text"
                  id="tags"
                  name="tags"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-sm text-gray-500 mt-1">Separate tags with commas (e.g., budget, 2023, financial)</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Document File {!isEdit && '*'}
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.zip"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
                  >
                    {isEdit ? 'Replace File' : 'Select File'}
                  </button>
                  <span className="ml-3 text-gray-600">
                    {fileName ? fileName : 'No file selected'}
                  </span>
                </div>
                {!isEdit && !selectedFile && (
                  <p className="text-sm text-red-500 mt-1">File is required for new documents</p>
                )}
                {isEdit && !selectedFile && (
                  <p className="text-sm text-gray-500 mt-1">Current file: {fileName}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <Field
                    type="checkbox"
                    name="isPublic"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Make this document public</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Public documents are visible to all users. Private documents are only visible to administrators.
                </p>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/admin/documents')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || (!isEdit && !selectedFile)}
                  className={`px-4 py-2 rounded text-white ${
                    isSubmitting || (!isEdit && !selectedFile)
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Document' : 'Upload Document'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default DocumentForm; 