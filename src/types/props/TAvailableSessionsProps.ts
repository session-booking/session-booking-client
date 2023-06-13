import {TTimeSlot} from "../TTimeSlot";
import {TService} from "../TService";
import {TBooking} from "../TBooking";
import {TAvailableSession} from "../TAvailableSession";
import {TSession} from "../TSession";

export type TAvailableSessionsProps = {
    timeSlots: TTimeSlot[];
    bookings: TBooking[];
    sessions: TSession[];
    selectedService: TService | null;
    selectedAvailableSession: TTimeSlot | null;
    handleSelectedAvailableSession: (availableSession: TAvailableSession) => void;
}