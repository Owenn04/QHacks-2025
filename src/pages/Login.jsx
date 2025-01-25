import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { loginWithGoogle } from '../auth/Auth';

export const handleGoogleLogin = async (setUser, navigate) => {
  try {
    const loggedInUser = await loginWithGoogle();
    setUser(loggedInUser);
    navigate('/');
  } catch (error) {
    console.error('Google sign-in failed:', error);
  }
};

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      {!user ? (
        <button onClick={() => handleGoogleLogin(setUser, navigate)}>
          Sign in with Google
        </button>
      ) : (
        <p>You're already logged in.</p>
      )}
    </>
  );
};

export default Login;