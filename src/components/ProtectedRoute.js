import React from 'react';
import AuthPage from './AuthPage';

const ProtectedRoute = ({ user, onAuthenticate, children }) => {
  if (!user) {
    return <AuthPage onAuthenticate={onAuthenticate} />;
  }
  return children;
};

export default ProtectedRoute;