import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../App';

export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};