import { Routes, Route, Navigate } from 'react-router-dom';
import { NewLogin } from '../pages/NewLogin';
import { HelloWorld } from '../pages/HelloWorld';
import { useAuth } from '../contexts/AuthContext';
import { Spinner, Center, Box, Text } from '@chakra-ui/react';

function LoadingScreen() {
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (usuario) {
    return <Navigate to="/hello" replace />;
  }
  
  return <>{children}</>;
}

function RootRoute() {
  const { usuario, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (usuario) {
    return <Navigate to="/hello" replace />;
  }
  
  return <Navigate to="/login" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <NewLogin />
          </PublicRoute>
        }
      />
      
      <Route
        path="/hello"
        element={
          <PrivateRoute>
            <HelloWorld />
          </PrivateRoute>
        }
      />
      
      <Route path="/" element={<RootRoute />} />
      <Route path="*" element={<RootRoute />} />
    </Routes>
  );
}
