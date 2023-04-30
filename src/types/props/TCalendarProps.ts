import {TSession} from "../TSession";
import {TDay} from "../TDay";

export type TCalendarProps = {
    selectedWeek: TDay[];
    displayedDays: TDay[];
    sessions: TSession[];
    handleDeleteSession: (session: TSession | null) => void;
    handleNavigateDay: (left: boolean) => void;
}
