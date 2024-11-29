import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Test } from '../pages/Test';
import { useAuth } from '../contexts/AuthContext';
import { Spinner, Center, Box, Text } from '@chakra-ui/react';

function LoadingScreen() {
  return (
    <Center h="100vh" bg="gray.50">
      <Box textAlign="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text mt={4} color="gray.600">Carregando...</Text>
      </Box>
    </Center>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute: Current state', { usuario, loading, pathname: location.pathname });

  if (loading) {
    console.log('PrivateRoute: Loading...');
    return <LoadingScreen />;
  }

  if (!usuario) {
    console.log('PrivateRoute: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log('PrivateRoute: User found, rendering content');
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { usuario, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from || '/test';

  console.log('PublicRoute: Current state', { usuario, loading, from });

  if (loading) {
    console.log('PublicRoute: Loading...');
    return <LoadingScreen />;
  }

  if (usuario) {
    console.log('PublicRoute: User found, redirecting to:', from);
    return <Navigate to={from} replace />;
  }

  console.log('PublicRoute: No user, rendering login');
  return <>{children}</>;
}

export function AppRoutes() {
  const location = useLocation();
  console.log('AppRoutes: Current location', location);

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route
        path="/test"
        element={
          <PrivateRoute>
            <Test />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/test" replace />} />
      <Route path="*" element={<Navigate to="/test" replace />} />
    </Routes>
  );
}
