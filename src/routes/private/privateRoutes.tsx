import { ReactNode } from 'react';
import {
  seletCurrentUser,
  useCurrentToken,
} from '../../redux/features/auth/authSlice';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hook';
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(useCurrentToken);

  const user = useAppSelector(seletCurrentUser);

  //if no token.
  if (!token) {
    return <Navigate to="/" replace={true} />;
  }

  // validate is the user is admin
  if (!user?.isAdmin) {
    return <Navigate to="/access-denied" replace={true} />;
  }

  if (user?.isSuspend) {
    return <Navigate to="/account-suspended" replace={true} />;
  }

  return children;
};

export default ProtectedRoute;
