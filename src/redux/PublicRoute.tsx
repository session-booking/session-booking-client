import React from 'react';
import {Navigate} from 'react-router-dom';
import {useTokenValidation} from '../hooks/useTokenValidation';
import ClipLoader from 'react-spinners/ClipLoader';

interface PublicRouteProps {
    component: React.ComponentType;
}

const spinnerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
};

const PublicRoute: React.FC<PublicRouteProps> = ({component: Component}) => {
    const {isValidToken, loading} = useTokenValidation();

    if (loading) {
        return (
            <div style={spinnerStyle}>
                <ClipLoader color="#3f51b5" size={50}/>
            </div>
        );
    }

    return !isValidToken ? <Component/> : <Navigate to="/" replace/>;
};

export default PublicRoute;