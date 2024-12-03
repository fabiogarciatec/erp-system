import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import { HelloWorld } from '../pages/HelloWorld';
import { useAuth } from '../contexts/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';
function LoadingScreen() {
    return (_jsx(Center, { h: "100vh", children: _jsx(Spinner, { size: "xl" }) }));
}
function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return _jsx(LoadingScreen, {});
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return _jsx(LoadingScreen, {});
    }
    if (user) {
        return _jsx(Navigate, { to: "/hello", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
function RootRoute() {
    const { user, loading } = useAuth();
    if (loading) {
        return _jsx(LoadingScreen, {});
    }
    if (user) {
        return _jsx(Navigate, { to: "/hello", replace: true });
    }
    return _jsx(Navigate, { to: "/login", replace: true });
}
export function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(PublicRoute, { children: _jsx(Login, {}) }) }), _jsx(Route, { path: "/hello", element: _jsx(PrivateRoute, { children: _jsx(HelloWorld, {}) }) }), _jsx(Route, { path: "/", element: _jsx(RootRoute, {}) }), _jsx(Route, { path: "*", element: _jsx(RootRoute, {}) })] }));
}
