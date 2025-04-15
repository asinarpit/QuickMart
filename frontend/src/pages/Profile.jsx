import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiSave, FiCalendar, FiShield, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { updateProfile, resetAuthError } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import moment from 'moment';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  console.log(user);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthError());
    }
  }, [error, dispatch]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormChanged(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email) {
      toast.error('Name and email are required');
      return;
    }
    
    if (password && password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    const userData = { name, email };
    if (password) userData.password = password;
    
    dispatch(updateProfile(userData))
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully');
        setFormData({
          ...formData,
          password: '',
          confirmPassword: '',
        });
        setFormChanged(false);
      })
      .catch((err) => {
        toast.error(err || 'Failed to update profile');
      });
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and settings</p>
        </div>

        {/* Profile Card */}
        {user && (
          <motion.div
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                  <FiShield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                  <FiCalendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{moment(user.createdAt).format('MMM D, YYYY')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Update Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <FiUser className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full pl-11 pr-11 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full pl-11 pr-11 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !formChanged}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3.5 px-6 rounded-lg font-medium transition-all ${
                isLoading || !formChanged
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <FiSave className="w-5 h-5" />
                  Save Changes
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;