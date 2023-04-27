import React, {useEffect, useState} from "react";
import {TSession} from "../types/TSession";
import LogApi from "../api/LogApi";
import SessionApi from "../api/SessionApi";
import {TDay} from "../types/TDay";
import "../Calendar.css";
import CreateSessionDialog from "./CreateSessionDialog";
import CreateSessionButton from "./CreateSessionButton";
import MonthlyCalendar from "./MonthlyCalendar";
import Calendar from "./Calendar";
import Hamburger from "hamburger-react";
import {eachDayOfInterval, format, startOfWeek} from 'date-fns';
import {enUS} from 'date-fns/locale';

function CalendarManagement() {

    // Displayed days in a week
    const [days, setDays] = useState<TDay[]>(getDaysOfCurrentWeek());

    // CalendarManagement state
    const [sessions, setSessions] = useState<TSession[]>([]);

    // Sidebar state
    const [sidebarVisible, setSidebarVisible] = useState(false);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const toggleDialog = () => {
        setIsDialogOpen(!isDialogOpen);
    };

    // Called when the component mounts (side effects code) and before it unmounts (cleanup code)
    useEffect(() => {
        async function fetchSessions() {
            const allSessions = await SessionApi.getSessions();
            setSessions(allSessions);
        }

        fetchSessions().catch((error) => {
            LogApi.logError(error.toString(), null);
        });
    }, []);

    function handleDeleteSession(session: TSession | null) {
        if (session != null) {
            SessionApi.deleteSession(session);
            setSessions(sessions.filter((s) => s.id !== session.id));
        } else {
            LogApi.logWarn("Cannot delete session, because it is null", null);
        }
    }

    function handleSelectedWeek(selectedWeek: Date[]) {
        const days: TDay[] = selectedWeek.map((date) => ({
            name: format(date, 'eee', { locale: enUS }),
            date: format(date, 'P'),
        }));

        setDays(days);
    }

    function handleChange(newSession: TSession) {
        setSessions([...sessions, newSession]);
    }

    function getDaysOfCurrentWeek(): TDay[] {
        const startOfTheWeek = startOfWeek(new Date(), {weekStartsOn: 1});
        const endOfTheWeek = new Date(startOfTheWeek);
        endOfTheWeek.setDate(startOfTheWeek.getDate() + 6);

        return eachDayOfInterval({start: startOfTheWeek, end: endOfTheWeek}).map((date) => ({
            name: format(date, 'eee', {locale: enUS}),
            date: format(date, 'P'),
        }));
    }

    return (
        <div className="flex">
            <CreateSessionDialog
                isDialogOpen={isDialogOpen}
                toggleDialog={toggleDialog}
                handleChange={handleChange}
            />
            <div className={`session-management-container ${sidebarVisible ? "visible" : ""}`}>
                <div className="content-display">
                    <CreateSessionButton handleToggleDialog={toggleDialog}/>
                    <MonthlyCalendar handleSelectedWeek={handleSelectedWeek}/>
                </div>
            </div>
            <div className="hamburger-visibility">
                <Hamburger
                    color={"#000000"}
                    toggled={sidebarVisible}
                    toggle={toggleSidebar}
                />
            </div>
            <Calendar
                days={days}
                sessions={sessions}
                handleDeleteSession={handleDeleteSession}
            />
        </div>
    );
}

export default CalendarManagement;