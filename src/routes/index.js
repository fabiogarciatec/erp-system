import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import { HelloWorld } from '../pages/HelloWorld';
import { useAuth } from '../contexts/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';
import Profile from '../pages/configuracoes/Profile';
import Permissions from '../pages/configuracoes/Permissions';
import Layout from '../components/Layout';
function LoadingScreen() {
    return (_jsx(Center, { position: "fixed", top: "0", left: "0", right: "0", bottom: "0", w: "100vw", h: "100vh", bg: "white", zIndex: 9999, children: _jsx(Spinner, { size: "xl", thickness: "4px", speed: "0.65s", color: "blue.500" }) }));
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
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
function RootRoute() {
    const { user, loading } = useAuth();
    if (loading) {
        return _jsx(LoadingScreen, {});
    }
    if (user) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(Navigate, { to: "/login", replace: true });
}
export function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(PublicRoute, { children: _jsx(Login, {}) }) }), _jsx(Route, { path: "/hello", element: _jsx(PrivateRoute, { children: _jsx(Layout, { children: _jsx(HelloWorld, {}) }) }) }), _jsx(Route, { path: "/profile", element: _jsx(PrivateRoute, { children: _jsx(Layout, { children: _jsx(Profile, {}) }) }) }), _jsx(Route, { path: "/configuracoes/permissoes", element: _jsx(PrivateRoute, { children: _jsx(Layout, { children: _jsx(Permissions, {}) }) }) }), _jsx(Route, { path: "/", element: _jsx(RootRoute, {}) }), _jsx(Route, { path: "*", element: _jsx(RootRoute, {}) })] }));
}
