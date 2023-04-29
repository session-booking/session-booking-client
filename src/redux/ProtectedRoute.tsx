import React from 'react';
import {Navigate} from 'react-router-dom';
import {isTokenValid} from "./helpers/tokenHelper";

interface ProtectedRouteProps {
    component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({component: Component}) => {
    const isValidToken = isTokenValid();

    return isValidToken ? <Component/> : <Navigate to="/login" replace/>;
};

export default ProtectedRoute;