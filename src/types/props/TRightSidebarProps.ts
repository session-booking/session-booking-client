import {ContentType} from "../../enums/ContentType";
import {TBooking} from "../TBooking";
import {TService} from "../TService";

export type TRightSidebarProps = {
    content: ContentType;
    bookings: TBooking[];
    services: TService[];
    handleAcceptedNotification: (booking: TBooking) => void;
    handleDeclinedNotification: (booking: TBooking) => void;
}