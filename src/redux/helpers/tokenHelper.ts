import UserApi from "../../api/UserApi";
import {loginUser} from "../state/userSlice";
import {useDispatch} from "react-redux";

export async function isTokenValid(dispatch: ReturnType<typeof useDispatch>): Promise<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    try {
        const response = await UserApi.getUser(token);

        if (response.httpCode === 200 && response.user) {
            dispatch(
                loginUser({
                    id: response.user.id,
                    username: response.user.username,
                    email: response.user.email,
                    phoneNumber: response.user.phoneNumber,
                })
            );
            return true;
        }
    } catch (error: any) {
        return false;
    }

    return false;
}