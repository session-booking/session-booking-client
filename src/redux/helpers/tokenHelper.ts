import jwt_decode from 'jwt-decode';

interface JwtPayload {
    exp: number;
}

export function isTokenValid(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    try {
        const decoded = jwt_decode<JwtPayload>(token);

        if (!decoded || !decoded.exp) {
            return false;
        }

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTimeInSeconds;
    } catch (error) {
        return false;
    }
}