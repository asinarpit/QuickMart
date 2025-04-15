import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FiSearch, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { getUsers, updateUserRole, deleteUser, resetAuthState } from '../../features/auth/authSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error, success, message } = useSelector(state => state.auth);
  const { userInfo } = useSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  
  useEffect(() => {
    if (users) {
      let filtered = [...users];
      
      if (searchTerm) {
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (roleFilter !== 'all') {
        filtered = filtered.filter(user => 
          roleFilter === 'admin' ? user.isAdmin : !user.isAdmin
        );
      }
      
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm, roleFilter]);
  
  useEffect(() => {
    if (success) {
      toast.success(message || 'User updated successfully');
      dispatch(resetAuthState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthState());
    }
  }, [success, error, message, dispatch]);
  
  const handleRoleToggle = (id, isCurrentlyAdmin) => {
    if (id === userInfo._id) {
      return toast.error("You cannot change your own admin status");
    }
    
    const confirmMessage = isCurrentlyAdmin 
      ? 'Remove admin privileges from this user?' 
      : 'Make this user an admin?';
      
    if (window.confirm(confirmMessage)) {
      dispatch(updateUserRole({ id, isAdmin: !isCurrentlyAdmin }));
    }
  };
  
  const handleDeleteUser = (id) => {
    if (id === userInfo._id) {
      return toast.error("You cannot delete your own account");
    }
    
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      dispatch(deleteUser(id));
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="min-w-[200px]">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="admin">Admins</option>
              <option value="customer">Customers</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user._id} className={`hover:bg-gray-50 ${user._id === userInfo._id ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name} {user._id === userInfo._id && <span className="text-xs text-gray-500">(You)</span>}
                          </div>
                          <div className="text-sm text-gray-500">ID: {user._id.substring(user._id.length - 6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleRoleToggle(user._id, user.isAdmin)}
                          className={`p-1 ${
                            user._id === userInfo._id 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : user.isAdmin 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                          }`}
                          disabled={user._id === userInfo._id}
                          title={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        >
                          {user.isAdmin ? <FiXCircle className="h-5 w-5" /> : <FiCheckCircle className="h-5 w-5" />}
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className={`text-red-600 hover:text-red-900 p-1 ${
                            user._id === userInfo._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={user._id === userInfo._id}
                          title="Delete User"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || roleFilter !== 'all'
                      ? 'No users found matching your criteria.'
                      : 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                  <span className="font-medium">
                    {indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}
                  </span>{' '}
                  of <span className="font-medium">{filteredUsers.length}</span> results
                </p>
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium 
                    ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium 
                      ${currentPage === number + 1 
                        ? 'z-10 bg-primary border-primary text-white' 
                        : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {number + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium 
                    ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList; 