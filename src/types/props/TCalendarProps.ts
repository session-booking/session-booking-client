import {TSession} from "../TSession";
import {TDay} from "../TDay";
import {TTimeSlot} from "../TTimeSlot";

export type TCalendarProps = {
    selectedWeek: TDay[];
    sessions: TSession[];
    timeSlots: TTimeSlot[];
    handleDeleteSession: (session: TSession | null) => void;
    handleCreateTimeSlot: (newTimeSlot: TTimeSlot) => void;
    handleDeleteTimeSlot: (timeSlot: TTimeSlot | null) => void;
}
