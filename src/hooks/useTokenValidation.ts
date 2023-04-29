import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {isTokenValid} from "../redux/helpers/tokenHelper";

export const useTokenValidation = () => {
    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkToken = async () => {
            const valid = await isTokenValid(dispatch);
            setIsValidToken(valid);
            setLoading(false);
        };
        checkToken();
    }, [dispatch]);

    return { isValidToken, loading };
};