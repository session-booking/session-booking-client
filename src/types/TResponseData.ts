import {TUser} from "./TUser";

export type TResponseData = {
    message: string;
    httpCode: number;
    user?: TUser;
    token?: string;
}