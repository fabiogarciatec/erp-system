import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner, Flex } from '@chakra-ui/react';
export function PrivateRoute({ children, requiredPermission, requiredRole }) {
    const { user, loading, hasPermission, hasRole } = useAuth();
    const location = useLocation();
    if (loading) {
        return (_jsx(Flex, { justify: "center", align: "center", h: "100vh", children: _jsx(Spinner, { size: "xl" }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    if (requiredPermission && !hasPermission(requiredPermission)) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    if (requiredRole && !hasRole(requiredRole)) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
