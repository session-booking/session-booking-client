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