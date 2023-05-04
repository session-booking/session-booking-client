export type TSession = {
    id?: number;
    date: Date | null;
    open: boolean;
    startTime: string;
    endTime: string;
    clientEmail: string;
    clientName: string;
    color: string;
};