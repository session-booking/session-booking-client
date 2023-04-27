import {TSession} from "../TSession";
import {TDay} from "../TDay";

export type TCalendarProps = {
    days: TDay[];
    sessions: TSession[];
    handleDeleteSession: (session: TSession | null) => void;
}
