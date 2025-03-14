import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMemberById, createMember, updateMember, reset } from '../../../features/panchayat/panchayatMemberSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function MemberForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  
  const { user } = useSelector((state) => state.auth);
  const { member, isLoading, isError, isSuccess, message } = useSelector((state) => state.panchayatMembers);
  
  const [isEdit, setIsEdit] = useState(false);
  const [preview, setPreview] = useState('');
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
    
    if (id) {
      setIsEdit(true);
      dispatch(getMemberById(id));
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
      toast.success('Panchayat member created successfully');
      navigate('/admin/panchayat/members');
    }
    
    if (isSuccess && isEdit) {
      toast.success('Panchayat member updated successfully');
    }
  }, [isError, isSuccess, message, isEdit, navigate]);
  
  const initialValues = {
    name: isEdit && member ? member.name : '',
    position: isEdit && member ? member.position : '',
    contactNumber: isEdit && member ? member.contactNumber : '',
    email: isEdit && member ? member.email : '',
    address: isEdit && member ? member.address : '',
    bio: isEdit && member ? member.bio : '',
    termStart: isEdit && member ? member.termStart.substring(0, 10) : '',
    termEnd: isEdit && member ? member.termEnd.substring(0, 10) : '',
    isActive: isEdit && member ? member.isActive : true
  };
  
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    position: Yup.string().required('Position is required'),
    contactNumber: Yup.string().required('Contact number is required'),
    email: Yup.string().email('Invalid email address'),
    address: Yup.string().required('Address is required'),
    termStart: Yup.date().required('Term start date is required'),
    termEnd: Yup.date().required('Term end date is required')
      .min(
        Yup.ref('termStart'),
        'Term end date must be after term start date'
      )
  });
  
  const handleSubmit = (values, { setSubmitting }) => {
    const formData = new FormData();
    
    formData.append('name', values.name);
    formData.append('position', values.position);
    formData.append('contactNumber', values.contactNumber);
    formData.append('email', values.email || '');
    formData.append('address', values.address);
    formData.append('bio', values.bio || '');
    formData.append('termStart', values.termStart);
    formData.append('termEnd', values.termEnd);
    formData.append('isActive', values.isActive);
    
    if (fileInputRef.current.files[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }
    
    if (isEdit) {
      dispatch(updateMember({ id, memberData: formData }));
    } else {
      dispatch(createMember(formData));
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
  
  if (isLoading || (isEdit && !member)) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Panchayat Member' : 'Add Panchayat Member'}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Full name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="position" className="block text-gray-700 font-medium mb-2">Position</label>
                    <Field
                      type="text"
                      id="position"
                      name="position"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Sarpanch, Ward Member"
                    />
                    <ErrorMessage name="position" component="div" className="text-red-500 mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="contactNumber" className="block text-gray-700 font-medium mb-2">Contact Number</label>
                    <Field
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Phone number"
                    />
                    <ErrorMessage name="contactNumber" component="div" className="text-red-500 mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email (Optional)</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email address"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Address</label>
                    <Field
                      type="text"
                      id="address"
                      name="address"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Residential address"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 mt-1" />
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <label htmlFor="termStart" className="block text-gray-700 font-medium mb-2">Term Start Date</label>
                    <Field
                      type="date"
                      id="termStart"
                      name="termStart"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="termStart" component="div" className="text-red-500 mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="termEnd" className="block text-gray-700 font-medium mb-2">Term End Date</label>
                    <Field
                      type="date"
                      id="termEnd"
                      name="termEnd"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="termEnd" component="div" className="text-red-500 mt-1" />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">Bio (Optional)</label>
                    <Field
                      as="textarea"
                      id="bio"
                      name="bio"
                      rows="4"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief biography"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Profile Image (Optional)</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept="image/*"
                    />
                    {(preview || (isEdit && member && member.image)) && (
                      <div className="mt-2">
                        <img
                          src={preview || `/uploads/${member.image}`}
                          alt="Profile preview"
                          className="w-32 h-32 object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center">
                      <Field
                        type="checkbox"
                        name="isActive"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-gray-700">Active Member</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/admin/panchayat/members')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default MemberForm; 