import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { loginWithGoogle } from '../auth/auth';

const Login = () => {
  const { user, setUser } = useContext(UserContext); // Get both user and setter
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const loggedInUser = await loginWithGoogle();
      setUser(loggedInUser);
      navigate('/');
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  return (
    <>
      {!user ? (
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      ) : (
        <p>You're already logged in.</p>
      )}
    </>
  );
};

export default Login;