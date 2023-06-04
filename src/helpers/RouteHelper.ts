import {useDispatch} from "react-redux";
import UserApi from "../api/UserApi";
import {loginUser} from "../redux/state/userSlice";

export class RouteHelper {

    static async isTokenValid(dispatch: ReturnType<typeof useDispatch>): Promise<boolean> {
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

    static async checkUser(decodedId: string) {
        try {
            return await UserApi.checkUser(decodedId);
        } catch (error: any) {
            return false;
        }
    }

}