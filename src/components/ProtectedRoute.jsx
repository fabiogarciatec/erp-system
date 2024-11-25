import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { usePermissions } from '../contexts/PermissionsContext';
import { useAuth } from '../contexts/AuthContext';
import { Center, Spinner } from '@chakra-ui/react';

// Componente de loading interno
const LoadingScreen = () => (
  <Center h="100vh">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  </Center>
);

export const ProtectedRoute = ({ 
  children, 
  adminOnly = false
}) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica se é uma rota de redefinição de senha
  const isResetPasswordRoute = location.pathname === '/reset-password';
  const hasResetToken = location.hash.includes('type=recovery') || location.search.includes('type=recovery');

  useEffect(() => {
    // Se for rota de reset de senha com token, permite acesso
    if (isResetPasswordRoute && hasResetToken) {
      return;
    }

    // Caso contrário, aplica proteção normal da rota
    if (!loading && !user) {
      console.log('Não autenticado, redirecionando para login');
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [user, loading, navigate, location, isResetPasswordRoute, hasResetToken]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Permite acesso à página de reset de senha se tiver token
  if (isResetPasswordRoute && hasResetToken) {
    return children;
  }

  if (!user) {
    return null;
  }

  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
};
