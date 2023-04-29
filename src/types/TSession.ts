// Attribute names need to be the same as the ones defined in server models
export type TSession = {
    id?: number;
    date: Date | null;
    open: boolean;
    start_time: string;
    end_time: string;
    client_email: string;
    client_name: string;
    color: string;
};