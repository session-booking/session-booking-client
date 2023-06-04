import React from 'react';
import {Navigate} from 'react-router-dom';
import {useTokenValidation} from '../hooks/useTokenValidation';
import ClipLoader from 'react-spinners/ClipLoader';
import {TRouteProps} from "../types/props/TRouteProps";

const PublicRoute: React.FC<TRouteProps> = ({component: Component}) => {
    const {isValidToken, loading} = useTokenValidation();

    if (loading) {
        return (
            <div className="loading-spinner">
                <ClipLoader color="#3f51b5" size={50}/>
            </div>
        );
    }

    return !isValidToken ? <Component/> : <Navigate to="/" replace/>;
};

export default PublicRoute;