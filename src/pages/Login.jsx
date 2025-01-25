import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { loginWithGoogle } from '../auth/auth';

const Login = () => {
  const user = useContext(UserContext);
  console.log(user);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const loggedInUser = await loginWithGoogle();
      // Update the user state in the App component
      setUser(loggedInUser);
      navigate('/');
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  return (
    <div>
      {!user ? (
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      ) : (
        <p>You're already logged in.</p>
      )}
    </div>
  );
};

export default Login;