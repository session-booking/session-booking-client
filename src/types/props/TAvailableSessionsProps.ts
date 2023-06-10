import {TTimeSlot} from "../TTimeSlot";
import {TService} from "../TService";
import {TBooking} from "../TBooking";
import {TAvailableSession} from "../TAvailableSession";

export type TAvailableSessionsProps = {
    timeSlots: TTimeSlot[];
    bookings: TBooking[];
    selectedService: TService | null;
    selectedAvailableSession: TTimeSlot | null;
    handleSelectedAvailableSession: (availableSession: TAvailableSession) => void;
}