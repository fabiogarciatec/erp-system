import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import { HelloWorld } from '../pages/HelloWorld';
import { useAuth } from '../contexts/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';
import Profile from '../pages/configuracoes/Profile';
import Permissions from '../pages/configuracoes/Permissions';
import Layout from '../components/Layout';

function LoadingScreen() {
  return (
    <Center 
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      w="100vw"
      h="100vh"
      bg="white"
      zIndex={9999}
    >
      <Spinner 
        size="xl" 
        thickness="4px"
        speed="0.65s"
        color="blue.500"
      />
    </Center>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function RootRoute() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
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
            <Login />
          </PublicRoute>
        }
      />
      
      <Route
        path="/hello"
        element={
          <PrivateRoute>
            <Layout>
              <HelloWorld />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/configuracoes/permissoes"
        element={
          <PrivateRoute>
            <Layout>
              <Permissions />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route path="/" element={<RootRoute />} />
      <Route path="*" element={<RootRoute />} />
    </Routes>
  );
}
