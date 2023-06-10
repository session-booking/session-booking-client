export type TBooking = {
    id?: number;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    date: Date | null;
    startTime: string;
    endTime: string;
    userId: number;
    serviceId?: number;
    timeSlotId?: number;
}