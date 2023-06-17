import {TSession} from "../TSession";
import {TDay} from "../TDay";
import {TTimeSlot} from "../TTimeSlot";
import React from "react";

export type TCalendarProps = {
    highlightedRef: React.RefObject<HTMLDivElement>;
    scrollableContainerRef: React.RefObject<HTMLDivElement>;
    scrollToHighlighted: () => void;
    selectedWeek: TDay[];
    sessions: TSession[];
    timeSlots: TTimeSlot[];
    handleDeleteSession: (session: TSession | null) => void;
    handleCreateTimeSlot: (newTimeSlot: TTimeSlot) => void;
    handleDeleteTimeSlot: (timeSlot: TTimeSlot | null) => void;
}
