import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {RouteHelper} from "../helpers/RouteHelper";

export const useTokenValidation = () => {
    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkToken = async () => {
            const valid = await RouteHelper.isTokenValid(dispatch);
            setIsValidToken(valid);
            setLoading(false);
        };
        checkToken();
    }, [dispatch]);

    return {isValidToken, loading};
};