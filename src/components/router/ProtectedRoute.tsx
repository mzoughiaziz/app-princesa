import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  isAuth: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuth }) => {
  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
