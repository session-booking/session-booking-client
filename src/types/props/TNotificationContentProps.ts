import {TBooking} from "../TBooking";
import {TService} from "../TService";

export type TNotificationContentProps = {
    bookings: TBooking[];
    services: TService[];
    handleAcceptedNotification: (booking: TBooking, color: string) => void;
    handleDeclinedNotification: (booking: TBooking) => void;
}