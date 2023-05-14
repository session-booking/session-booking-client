import React, {useEffect, useRef, useState} from "react";
import {TSession} from "../types/TSession";
import LogApi from "../api/LogApi";
import SessionApi from "../api/SessionApi";
import {TDay} from "../types/TDay";
import "../Calendar.css";
import CreateSessionButton from "./CreateSessionButton";
import MonthlyCalendar from "./MonthlyCalendar";
import Calendar from "./Calendar";
import Hamburger from "hamburger-react";
import {eachDayOfInterval, format, startOfWeek} from 'date-fns';
import {enUS} from 'date-fns/locale';
import Header from "./Header";
import RightSidebar from "./RightSidebar";
import {ContentType} from "../enums/ContentType";
import CreateSession from "./CreateSession";
import Dialog from "./Dialog";
import {TTimeSlot} from "../types/TTimeSlot";
import TimeSlotApi from "../api/TimeSlotApi";

function CalendarManagement() {

    // Selected week state
    const [selectedWeek, setSelectedWeek] = useState<TDay[]>(getDaysOfCurrentWeek());

    // Weekly sessions state
    const [sessions, setSessions] = useState<TSession[]>([]);

    // Weekly time slots state
    const [timeSlots, setTimeSlots] = useState<TTimeSlot[]>([]);

    // Left sidebar state
    const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);

    // Right sidebar visibility and content state
    const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
    const [rightSidebarContent, setRightSidebarContent] = useState<ContentType>(ContentType.NO_CONTENT);

    // Dialog state
    const [isCreateSessionDialogOpen, setIsCreateSessionDialogOpen] = useState<boolean>(false);

    // Sidebar refs
    const leftSidebarRef = useRef<HTMLDivElement>(null);
    const rightSidebarRef = useRef<HTMLDivElement>(null);

    // Hamburger ref
    const hamburgerRef = useRef<HTMLDivElement>(null);

    // Header button refs
    const qrButtonRef = useRef<HTMLButtonElement>(null);
    const notificationButtonRef = useRef<HTMLButtonElement>(null);
    const settingsButtonRef = useRef<HTMLButtonElement>(null);

    const toggleSidebar = () => {
        setLeftSidebarVisible(!leftSidebarVisible);
    };

    const hideSidebar = () => {
        setLeftSidebarVisible(false);
    }

    const toggleCreateSessionDialog = () => {
        setIsCreateSessionDialogOpen(!isCreateSessionDialogOpen);
    };

    const handleHeaderButtonClick = (content: ContentType) => {
        if (content == rightSidebarContent) {
            setRightSidebarVisible(false);
            setRightSidebarContent(ContentType.NO_CONTENT);
        } else {
            setRightSidebarVisible(true);
            setRightSidebarContent(content);
        }
    };

    // Called when the component mounts (side effects code) and before it unmounts (cleanup code)
    useEffect(() => {
        async function fetchSessions() {
            const allSessions = await SessionApi.getSessions(selectedWeek[0].date, selectedWeek[6].date);
            setSessions(allSessions);
        }

        async function fetchTimeSlots() {
            const allTimeSlots = await TimeSlotApi.getTimeSlots(selectedWeek[0].date, selectedWeek[6].date);
            setTimeSlots(allTimeSlots);
        }

        document.addEventListener("click", handleClickOutsideForLeftSidebar, true);
        document.addEventListener("click", handleClickOutsideForRightSidebar, true);

        fetchSessions().catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        fetchTimeSlots().catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        return () => {
            document.removeEventListener("click", handleClickOutsideForLeftSidebar, true);
            document.removeEventListener("click", handleClickOutsideForRightSidebar, true);
        };
    }, [selectedWeek]);

    async function handleCreateSession(session: TSession) {
        try {
            const newSession = await SessionApi.createSession(session);
            setSessions([...sessions, newSession]);
        } catch (error: any) {
            LogApi.logError(error.toString(), session);
        }
    }

    function handleDeleteSession(session: TSession | null) {
        if (session != null) {
            SessionApi.deleteSession(session);
            setSessions(sessions.filter((s) => s.id !== session.id));
        } else {
            LogApi.logError("Cannot delete session, because it is null", null);
        }
    }

    async function handleCreateTimeSlot(timeSlot: TTimeSlot) {
        try {
            const newTimeSlot = await TimeSlotApi.createTimeSlot(timeSlot);
            setTimeSlots([...timeSlots, newTimeSlot]);
        } catch (error: any) {
            LogApi.logError(error.toString(), timeSlot);
        }
    }

    function handleDeleteTimeSlot(timeSlot: TTimeSlot | null) {
        if (timeSlot != null) {
            TimeSlotApi.deleteTimeSlot(timeSlot);
            setTimeSlots(timeSlots.filter((s) => s.id !== timeSlot.id));
        } else {
            LogApi.logError("Cannot delete time slot, because it is null", null);
        }
    }

    function handleSelectedWeek(selectedWeek: Date[]) {
        const updatedWeek: TDay[] = selectedWeek.map((date) => ({
            name: format(date, 'eee', {locale: enUS}),
            displayDate: format(date, 'P'),
            date: date,
        }));

        setSelectedWeek(updatedWeek);
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

    function handleClickOutsideForLeftSidebar(event: MouseEvent) {
        if (leftSidebarRef.current && !leftSidebarRef.current.contains(event.target as Node) &&
            hamburgerRef.current && !hamburgerRef.current.contains(event.target as Node)) {
            hideSidebar();
        }
    }

    function handleClickOutsideForRightSidebar(event: MouseEvent) {
        if (rightSidebarRef.current && !rightSidebarRef.current.contains(event.target as Node)
            && qrButtonRef.current && !qrButtonRef.current.contains(event.target as Node)
            && notificationButtonRef.current && !notificationButtonRef.current.contains(event.target as Node)
            && settingsButtonRef.current && !settingsButtonRef.current.contains(event.target as Node)) {
            setRightSidebarVisible(false);
            setRightSidebarContent(ContentType.NO_CONTENT);
        }
    }

    return (
        <>
            <Header
                qrButtonRef={qrButtonRef}
                notificationButtonRef={notificationButtonRef}
                settingsButtonRef={settingsButtonRef}
                rightSidebarContent={rightSidebarContent}
                onHeaderButtonClick={handleHeaderButtonClick}
            />
            <div className="flex">
                <Dialog
                    isDialogOpen={isCreateSessionDialogOpen}
                    toggleDialog={toggleCreateSessionDialog}
                >
                    <CreateSession
                        hideSidebar={hideSidebar}
                        handleCreate={handleCreateSession}
                        handleToggleDialog={toggleCreateSessionDialog}
                    />
                </Dialog>
                <div ref={leftSidebarRef} className={`left-sidebar-container ${leftSidebarVisible ? "visible" : ""}`}>
                    <div className="content-display">
                        <CreateSessionButton handleToggleDialog={toggleCreateSessionDialog}/>
                        <MonthlyCalendar handleSelectedWeek={handleSelectedWeek}/>
                    </div>
                </div>
                <div ref={rightSidebarRef}
                     className={`right-sidebar-container ${rightSidebarVisible ? "visible" : ""}`}>
                    <RightSidebar content={rightSidebarContent}/>
                </div>
                <div ref={hamburgerRef} className="hamburger-visibility">
                    <Hamburger
                        color={"#000000"}
                        toggled={leftSidebarVisible}
                        toggle={toggleSidebar}
                    />
                </div>
                <Calendar
                    selectedWeek={selectedWeek}
                    sessions={sessions}
                    timeSlots={timeSlots}
                    handleDeleteSession={handleDeleteSession}
                    handleCreateTimeSlot={handleCreateTimeSlot}
                    handleDeleteTimeSlot={handleDeleteTimeSlot}
                />
            </div>
        </>
    );
}

export default CalendarManagement;