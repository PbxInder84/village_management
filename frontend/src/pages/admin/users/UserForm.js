import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserById, updateUser, reset } from '../../../features/users/userSlice';
import { register } from '../../../features/auth/authSlice';
import Spinner from '../../../components/common/Spinner';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function UserForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { user: authUser } = useSelector((state) => state.auth);
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.users);
  
  const [isEdit, setIsEdit] = useState(false);
  
  useEffect(() => {
    if (!authUser || authUser.role !== 'admin') {
      navigate('/login');
    }
    
    if (id) {
      setIsEdit(true);
      dispatch(getUserById(id));
    }
    
    return () => {
      dispatch(reset());
    };
  }, [authUser, id, navigate, dispatch]);
  
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    
    if (isSuccess && isEdit) {
      toast.success('User updated successfully');
      navigate('/admin/users');
    }
  }, [isError, isSuccess, isEdit, message, navigate]);
  
  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    role: user?.role || 'user',
    isActive: user?.isActive !== undefined ? user.isActive : true
  };
  
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: isEdit 
      ? Yup.string() 
      : Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: isEdit 
      ? Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
      : Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
    role: Yup.string().oneOf(['user', 'panch', 'sarpanch', 'admin'], 'Invalid role').required('Role is required')
  });
  
  const handleSubmit = (values, { setSubmitting }) => {
    if (isEdit) {
      const userData = {
        name: values.name,
        email: values.email,
        role: values.role,
        isActive: values.isActive
      };
      
      if (values.password) {
        userData.password = values.password;
      }
      
      dispatch(updateUser({ id, userData }));
    } else {
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role
      };
      
      dispatch(register(userData));
      toast.success('User created successfully');
      navigate('/admin/users');
    }
    
    setSubmitting(false);
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit User' : 'Add New User'}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password {isEdit && '(Leave blank to keep current password)'}
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 mt-1" />
              </div>
              
              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Role</label>
                <Field
                  as="select"
                  id="role"
                  name="role"
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  <option value="user">User</option>
                  <option value="panch">Panch</option>
                  <option value="sarpanch">Sarpanch</option>
                  <option value="admin">Admin</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500 mt-1" />
              </div>
              
              {isEdit && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Status</label>
                  <div className="flex items-center">
                    <Field
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      className="mr-2"
                    />
                    <label htmlFor="isActive">Active</label>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/admin/users')}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default UserForm; 