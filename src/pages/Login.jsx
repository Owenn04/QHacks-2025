import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import { loginWithGoogle } from '../auth/Auth';

export const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle();
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error; // Re-throw the error if you want the caller to handle it
  }
};

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;