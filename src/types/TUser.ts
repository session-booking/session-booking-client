// Attribute names need to be the same as the ones defined in server models
export type TUser = {
    id: number | null;
    username: string | null;
    email: string | null;
    password: string | null;
    phone_number: string | null;
}