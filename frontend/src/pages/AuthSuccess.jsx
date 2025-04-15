import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      dispatch(googleLogin(token))
        .unwrap()
        .then(() => {
          toast.success('Successfully logged in with Google!');
          navigate('/', { replace: true });
        })
        .catch((error) => {
          toast.error(error || 'Authentication failed');
          navigate('/login', { replace: true });
        });
    } else {
      toast.error('Authentication failed - No token received');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, dispatch]);
  
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
    </div>
  );
};

export default AuthSuccess; 