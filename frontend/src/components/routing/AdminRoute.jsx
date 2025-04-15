import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute; 