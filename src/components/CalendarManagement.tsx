import React, {useEffect, useRef, useState} from "react";
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

    // Selected week state
    const [selectedWeek, setSelectedWeek] = useState<TDay[]>(getDaysOfCurrentWeek());

    // Displayed days state
    const [displayedDays, setDisplayedDays] = useState<TDay[]>(updateDisplayedDays(selectedWeek));

    // CalendarManagement state
    const [sessions, setSessions] = useState<TSession[]>([]);

    // Sidebar state
    const [sidebarVisible, setSidebarVisible] = useState(false);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const sidebarRef = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const hideSidebar = () => {
        setSidebarVisible(false);
    }

    const toggleDialog = () => {
        setIsDialogOpen(!isDialogOpen);
    };

    // Called when the component mounts (side effects code) and before it unmounts (cleanup code)
    useEffect(() => {
        async function fetchSessions() {
            const allSessions = await SessionApi.getSessions();
            setSessions(allSessions);
        }

        const handleResize = () => {
            setDisplayedDays(updateDisplayedDays(selectedWeek));
        }

        window.addEventListener('resize', handleResize);
        document.addEventListener("click", handleClickOutside, true);

        fetchSessions().catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    function updateDisplayedDays(days: TDay[]) {
        const width = window.innerWidth;
        const sm = 480;
        const md = 768;
        const lg = 1024;

        return (width < sm)
            ? days.slice(0, 2)
            : (sm <= width && width < md)
                ? days.slice(0, 3)
                : (md <= width && width < lg)
                    ? days.slice(0, 5)
                    : days;
    }

    function handleDeleteSession(session: TSession | null) {
        if (session != null) {
            SessionApi.deleteSession(session);
            setSessions(sessions.filter((s) => s.id !== session.id));
        } else {
            LogApi.logWarn("Cannot delete session, because it is null", null);
        }
    }

    function handleSelectedWeek(selectedWeek: Date[]) {
        const week: TDay[] = selectedWeek.map((date) => ({
            name: format(date, 'eee', {locale: enUS}),
            displayDate: format(date, 'P'),
            date: date,
        }));

        setSelectedWeek(week);
        setDisplayedDays(updateDisplayedDays(week));
    }

    function handleNavigateDay(left: boolean) {
        setDisplayedDays(displayedDays.map((day) => {
            const updatedDay = new Date(day.date);
            updatedDay.setDate((left) ? updatedDay.getDate() - 1 : updatedDay.getDate() + 1);
            return {
                name: format(updatedDay, 'eee', {locale: enUS}),
                displayDate: format(updatedDay, 'P'),
                date: updatedDay,
            };
        }));
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
            displayDate: format(date, 'P'),
            date: date,
        }));
    }

    function handleClickOutside(event: MouseEvent) {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) &&
            hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node)) {
            hideSidebar();
        }
    }

    return (
        <div className="flex">
            <CreateSessionDialog
                hideSidebar={hideSidebar}
                isDialogOpen={isDialogOpen}
                toggleDialog={toggleDialog}
                handleChange={handleChange}
            />
            <div ref={sidebarRef} className={`sidebar-container ${sidebarVisible ? "visible" : ""}`}>
                <div className="content-display">
                    <CreateSessionButton handleToggleDialog={toggleDialog}/>
                    <MonthlyCalendar handleSelectedWeek={handleSelectedWeek}/>
                </div>
            </div>
            <div ref={hamburgerRef} className="hamburger-visibility">
                <Hamburger
                    color={"#000000"}
                    toggled={sidebarVisible}
                    toggle={toggleSidebar}
                />
            </div>
            <Calendar
                selectedWeek={selectedWeek}
                displayedDays={displayedDays}
                sessions={sessions}
                handleDeleteSession={handleDeleteSession}
                handleNavigateDay={handleNavigateDay}
            />
        </div>
    );
}

export default CalendarManagement;