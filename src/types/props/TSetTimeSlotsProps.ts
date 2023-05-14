import {TDay} from "../TDay";
import {TTimeSlot} from "../TTimeSlot";

export type TSetTimeSlotsProps = {
    selectedDay: TDay | null;
    timeSlots: TTimeSlot[];
    handleCreateTimeSlot: (newTimeSlot: TTimeSlot) => void;
    handleDeleteTimeSlot: (timeSlot: TTimeSlot | null) => void;
}