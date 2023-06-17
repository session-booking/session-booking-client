import {ContentType} from "../../enums/ContentType";
import {TBooking} from "../TBooking";
import {TService} from "../TService";
import {TUserEdit} from "../TUserEdit";

export type TRightSidebarProps = {
    content: ContentType;
    bookings: TBooking[];
    services: TService[];
    handleAcceptedNotification: (booking: TBooking, color: string) => void;
    handleDeclinedNotification: (booking: TBooking) => void;
    userEdit: TUserEdit;
    handleUserEditUsernameChange: (value: string) => void;
    handleUserEditPasswordChange: (value: string) => void;
    handleUserEditPhoneNumberChange: (value: string) => void;
    handleUpdateUser: () => Promise<boolean>;
    logout: () => void;
    toggleConfirmProfileDeletionDialog: () => void;
}