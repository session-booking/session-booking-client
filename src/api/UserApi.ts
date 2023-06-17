import {TUser} from "../types/TUser";
import {API_URL} from "./config/config";
import {TResponseData} from "../types/TResponseData";
import {TUserEdit} from "../types/TUserEdit";
import LogApi from "./LogApi";

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

    public async getUser(token: string): Promise<TResponseData> {
        const response = await fetch(`${API_URL}/api/user`, {
            method: "GET",
            headers: {
                "Authorization": token,
            }
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("message") || !responseObj.hasOwnProperty("httpCode")) {
            throw Error("missing message or httpCode attribute");
        }

        if (response.ok) {
            if (!responseObj.hasOwnProperty("user")) {
                throw Error("missing user attribute");
            }

            const userData = responseObj.user;

            return {
                message: responseObj.message,
                httpCode: responseObj.httpCode,
                user: this.mapUser(userData),
            }
        }

        return {
            message: responseObj.message,
            httpCode: responseObj.httpCode,
        };
    }

    public async updateUser(userData: TUserEdit): Promise<TUser> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        const response = await fetch(`${API_URL}/api/user`, {
            method: "PUT",
            body: JSON.stringify({userData}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Error updating user: ${response.statusText}`);
        }

        return this.mapUser(await response.json());
    }

    public async deleteUser(): Promise<void> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        return fetch(`${API_URL}/api/user`, {
            method: "DELETE",
            headers: {
                "Authorization": `${token}`,
            }
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`Error deleting user: ${response.statusText}`);
            } else {
                return response.json();
            }
        }).then((data) => {
                if (data[0] === 0) {
                    throw new Error(`User deletion not successful`);
            }
        }).catch((error) => {
            LogApi.logError(error, null);
        });
    }

    public async checkUser(id: string): Promise<boolean> {
        const response = await fetch(`${API_URL}/api/user/${id}`, {
            method: "GET",
        });

        const responseObj = await response.json();

        if (!responseObj.hasOwnProperty("message") || !responseObj.hasOwnProperty("httpCode")) {
            throw Error("missing message or httpCode attribute");
        }

        return response.ok;
    }

    private mapUser(object: any): TUser {
        return ({
            id: object.id,
            username: object.username,
            email: object.email,
            phoneNumber: object.phoneNumber,
            password: null,
        });
    }

}

export default new UserApi();