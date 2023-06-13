import {TClientDetails} from "../TClientDetails";
import {TService} from "../TService";
import {TAvailableSession} from "../TAvailableSession";

export type TBookingDetailsProps = {
    clientDetails: TClientDetails;
    selectedService: TService | null;
    selectedAvailableSession: TAvailableSession | null;
}