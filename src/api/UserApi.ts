import {TUser} from "../types/TUser";
import {API_URL} from "./config";
import {TResponseData} from "../types/TResponseData";

class UserApi {

    public async register(user: TUser): Promise<TResponseData> {
        const response = await fetch(`${API_URL}/api/user/register`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("message") || !responseObj.hasOwnProperty("httpCode")) {
            throw Error("missing message or httpCode attribute");
        }

        return {
            message: responseObj.message,
            httpCode: responseObj.httpCode,
        };
    }

    public async login(user: TUser): Promise<TResponseData> {
        const response = await fetch(`${API_URL}/api/user/login`, {
            method: "POST",
            body: JSON.stringify({user}),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("message") || !responseObj.hasOwnProperty("httpCode")) {
            throw Error("missing message or httpCode attribute");
        }

        if (response.ok) {
            if (!responseObj.hasOwnProperty("user") || !responseObj.hasOwnProperty("token")) {
                throw Error("missing user or token attribute");
            }

            const userData = responseObj.user;
            const token = responseObj.token;

            return {
                message: responseObj.message,
                httpCode: responseObj.httpCode,
                user: this.mapUser(userData),
                token: token,
            }
        }

        return {
            message: responseObj.message,
            httpCode: responseObj.httpCode,
        };
    }

    private mapUser(object: any): TUser {
        return ({
            id: object.id,
            username: object.username,
            email: object.email,
            phone_number: object.phone_number,
            password: null,
        });
    }

}

export default new UserApi();