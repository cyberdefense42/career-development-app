import React from 'react';
import { AuthProvider } from './contexts/DemoAuthContext';
import YouLementWebsite from './components/YouLementWebsite';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <YouLementWebsite />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
