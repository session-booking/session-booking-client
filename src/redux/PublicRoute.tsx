import React from 'react';
import { Navigate } from 'react-router-dom';
import {isTokenValid} from "./helpers/tokenHelper";

interface PublicRouteProps {
    component: React.ComponentType;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ component: Component }) => {
    const isValidToken = isTokenValid();

    return !isValidToken ? <Component /> : <Navigate to="/" replace />;
};

export default PublicRoute;