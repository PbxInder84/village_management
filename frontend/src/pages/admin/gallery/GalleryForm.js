import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getGalleryById, createGalleryItem, updateGalleryItem, reset } from '../../../features/gallery/gallerySlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function GalleryForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  const { galleryItem, isLoading, isError, isSuccess, message } = useSelector((state) => state.gallery);
  
  const [isEdit, setIsEdit] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    
    if (id) {
      setIsEdit(true);
      dispatch(getGalleryById(id));
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
      toast.success('Gallery item created successfully');
      navigate('/admin/gallery');
    }
    
    if (isSuccess && isEdit) {
      toast.success('Gallery item updated successfully');
    }
    
    if (isEdit && galleryItem && galleryItem.image) {
      setImagePreview(`/uploads/${galleryItem.image}`);
    }
  }, [isError, isSuccess, message, isEdit, navigate, galleryItem]);
  
  const initialValues = {
    title: isEdit && galleryItem ? galleryItem.title : '',
    description: isEdit && galleryItem ? galleryItem.description : '',
    category: isEdit && galleryItem ? galleryItem.category : 'events',
    tags: isEdit && galleryItem && galleryItem.tags ? galleryItem.tags.join(', ') : '',
    isPublished: isEdit && galleryItem ? galleryItem.isPublished : true
  };
  
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    category: Yup.string().required('Category is required')
  });
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('category', values.category);
    formData.append('tags', values.tags || '');
    formData.append('isPublished', values.isPublished);
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    
    if (isEdit) {
      dispatch(updateGalleryItem({ id, galleryData: formData }));
    } else {
      dispatch(createGalleryItem(formData));
    }
    
    setSubmitting(false);
  };
  
  if (isLoading || (isEdit && !galleryItem)) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Edit Gallery Item' : 'Add New Gallery Item'}
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
                  placeholder="Enter title"
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
                  placeholder="Enter description"
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
                  <option value="events">Events</option>
                  <option value="landmarks">Landmarks</option>
                  <option value="people">People</option>
                  <option value="development">Development</option>
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
                <p className="text-sm text-gray-500 mt-1">Separate tags with commas (e.g., festival, celebration, village)</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Image {!isEdit && '*'}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
                {!isEdit && !imagePreview && (
                  <p className="text-sm text-red-500 mt-1">Image is required for new gallery items</p>
                )}
                
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 w-auto object-cover rounded border"
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
                  <span className="ml-2 text-gray-700">Publish this item</span>
                </label>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/admin/gallery')}
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
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Gallery Item' : 'Add Gallery Item'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default GalleryForm; 