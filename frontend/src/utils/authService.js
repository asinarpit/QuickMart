import api from './api';

// Register user
const register = async (userData) => {
  const response = await api.post('/users', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post('/users/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Google auth login - get user info with token
const googleAuthLogin = async (token) => {
  try {
    // Set the token in the authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Get user data with the token
    const response = await api.get('/users/profile');
    
    // Create user data object with token and user info
    const userData = {
      token,
      user: response.data
    };
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error) {
    // If there's an error getting profile, at least save the token
    // This ensures the user is still logged in even if profile fetch fails
    const fallbackUserData = {
      token,
      user: { token }
    };
    localStorage.setItem('user', JSON.stringify(fallbackUserData));
    return fallbackUserData;
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Update user profile
const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Get all users (admin only)
const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Update user role (admin only)
const updateUserRole = async (id, isAdmin) => {
  const response = await api.put(`/users/${id}`, { isAdmin });
  return response.data;
};

// Delete user (admin only)
const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return { id, ...response.data };
};

const authService = {
  register,
  login,
  logout,
  updateProfile,
  getUsers,
  updateUserRole,
  deleteUser,
  googleAuthLogin,
};

export default authService; 