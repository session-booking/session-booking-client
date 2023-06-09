import React, {useEffect, useRef, useState} from "react";
import {TSession} from "../../types/TSession";
import LogApi from "../../api/LogApi";
import SessionApi from "../../api/SessionApi";
import {TDay} from "../../types/TDay";
import "../../Calendar.css";
import CreateSessionButton from "./CreateSessionButton";
import WeeklyCalendar from "./WeeklyCalendar";
import Calendar from "./Calendar";
import Hamburger from "hamburger-react";
import {eachDayOfInterval, format, startOfWeek} from 'date-fns';
import {enUS} from 'date-fns/locale';
import Header from "./Header";
import RightSidebar from "./RightSidebar";
import {ContentType} from "../../enums/ContentType";
import CreateSession from "./CreateSession";
import Dialog from "./Dialog";
import {TTimeSlot} from "../../types/TTimeSlot";
import TimeSlotApi from "../../api/TimeSlotApi";
import AddServiceButton from "./AddServiceButton";
import AddService from "./AddService";
import ServiceApi from "../../api/ServiceApi";
import {TService} from "../../types/TService";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/state/store";
import {io} from "socket.io-client";
import {API_URL} from "../../api/config/config";
import BookingApi from "../../api/BookingApi";
import {TBooking} from "../../types/TBooking";
import {TUserEdit} from "../../types/TUserEdit";
import UserApi from "../../api/UserApi";
import {CommonsHelper} from "../../helpers/CommonsHelper";
import {logoutUser, updateUser} from "../../redux/state/userSlice";
import {useNavigate} from "react-router-dom";
import ConfirmProfileDeletion from "./ConfirmProfileDeletion";

function CalendarManagement() {

    // Selected week state
    const [selectedWeek, setSelectedWeek] = useState<TDay[]>(getDaysOfCurrentWeek());

    // Weekly sessions state
    const [sessions, setSessions] = useState<TSession[]>([]);

    // Weekly time slots state
    const [timeSlots, setTimeSlots] = useState<TTimeSlot[]>([]);

    // Services state
    const [services, setServices] = useState<TService[]>([]);

    // Bookings state
    const [bookings, setBookings] = useState<TBooking[]>([]);

    // Left sidebar state
    const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);

    // Right sidebar visibility and content state
    const [rightSidebarVisible, setRightSidebarVisible] = useState(false);
    const [rightSidebarContent, setRightSidebarContent] = useState<ContentType>(ContentType.NO_CONTENT);

    // Create session dialog state
    const [isCreateSessionDialogOpen, setIsCreateSessionDialogOpen] = useState<boolean>(false);

    // Add service dialog state
    const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState<boolean>(false);

    // Confirm profile deletion dialog state
    const [isConfirmProfileDeletionDialogOpen, setIsConfirmProfileDeletionDialogOpen] = useState<boolean>(false);

    // Sidebar refs
    const leftSidebarRef = useRef<HTMLDivElement>(null);
    const rightSidebarRef = useRef<HTMLDivElement>(null);

    // Hamburger ref
    const hamburgerRef = useRef<HTMLDivElement>(null);

    // Header button refs
    const qrButtonRef = useRef<HTMLButtonElement>(null);
    const notificationButtonRef = useRef<HTMLButtonElement>(null);
    const settingsButtonRef = useRef<HTMLButtonElement>(null);

    // Highlighted div and container reference
    const highlightedRef = useRef<HTMLDivElement>(null);
    const scrollableContainerRef = useRef<HTMLDivElement | null>(null);

    // User id from redux store
    const userId = useSelector((state: RootState) => state.user.id);
    const username = useSelector((state: RootState) => state.user.username);
    const userPhone = useSelector((state: RootState) => state.user.phoneNumber);

    // User edit state
    const [userEdit, setUserEdit] = useState<TUserEdit>({
        username: (username != null) ? username : "",
        phoneNumber: (userPhone != null) ? userPhone: "",
        password: "",
    });

    // Redux hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setLeftSidebarVisible(!leftSidebarVisible);
    };

    const hideSidebar = () => {
        setLeftSidebarVisible(false);
    }

    const toggleCreateSessionDialog = () => {
        setIsCreateSessionDialogOpen(!isCreateSessionDialogOpen);
    };

    const toggleAddServiceDialog = () => {
        setIsAddServiceDialogOpen(!isAddServiceDialogOpen);
    }

    const toggleConfirmProfileDeletionDialog = () => {
        setIsConfirmProfileDeletionDialogOpen(!isConfirmProfileDeletionDialogOpen);
    }

    const handleHeaderButtonClick = (content: ContentType) => {
        if (content == rightSidebarContent) {
            setRightSidebarVisible(false);
            setRightSidebarContent(ContentType.NO_CONTENT);

            setUserEdit({
                username: (username != null) ? username : "",
                phoneNumber: (userPhone != null) ? userPhone: "",
                password: "",
            });
        } else {
            setRightSidebarVisible(true);
            setRightSidebarContent(content);
        }
    };

    const scrollToHighlighted = () => {
        if (highlightedRef.current && scrollableContainerRef.current) {
            const elementPosition: number = highlightedRef.current.offsetTop;
            const parentPosition: number = scrollableContainerRef.current.offsetTop;
            const targetScrollPosition: number = elementPosition - parentPosition;

            let startTime: number | null = null;
            let currentPosition: number = scrollableContainerRef.current.scrollTop;

            const easeInOutQuad = (t: number): number => t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t;

            const animateScroll = (currentTime: number) => {
                if (startTime === null) startTime = currentTime;
                const elapsed: number = currentTime - startTime;
                const duration: number = 300;
                const progress: number = Math.min(elapsed / duration, 1);

                if (scrollableContainerRef.current) {
                    scrollableContainerRef.current.scrollTop = currentPosition + (targetScrollPosition - currentPosition) * easeInOutQuad(progress);
                }

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };

            requestAnimationFrame(animateScroll);
        }
    };

    // Called when the component mounts (side effects code) and before it unmounts (cleanup code)
    useEffect(() => {
        const socket = io(API_URL);

        socket.on(`booking-update-${userId}`, (data) => {
            setBookings(prevBookings => [
                ...prevBookings,
                {
                    id: data.id,
                    clientName: data.clientName,
                    clientEmail: data.clientEmail,
                    clientPhone: data.clientPhone,
                    date: data.date,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    status: data.status,
                    userId: data.userId,
                    serviceId: data.serviceId,
                    timeSlotId: data.timeSlotId,
                }]);
        });

        async function fetchSessions() {
            const sessions = await SessionApi.getSessionsByDateInterval(selectedWeek[0].date, selectedWeek[6].date);
            setSessions(sessions);
        }

        async function fetchTimeSlots() {
            const timeSlots = await TimeSlotApi.getTimeSlotsByDateInterval(selectedWeek[0].date, selectedWeek[6].date);
            setTimeSlots(timeSlots);
        }

        async function fetchServices() {
            const allServices = await ServiceApi.getServices(userId);
            setServices(allServices);
        }

        async function fetchBookings() {
            const bookings = await BookingApi.getAllBookings();
            setBookings(bookings);
        }

        document.addEventListener("click", handleClickOutsideForLeftSidebar, true);
        document.addEventListener("click", handleClickOutsideForRightSidebar, true);

        fetchSessions().catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        fetchTimeSlots().catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        fetchServices().catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        fetchBookings().catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        return () => {
            socket.disconnect();
            document.removeEventListener("click", handleClickOutsideForLeftSidebar, true);
            document.removeEventListener("click", handleClickOutsideForRightSidebar, true);
        };
    }, [selectedWeek]);

    function setCurrentWeek() {
        setSelectedWeek(getDaysOfCurrentWeek());
    }

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

    async function handleCreateService(service: TService) {
        service.length = service.length * 15;
        try {
            const newService = await ServiceApi.createService(service);
            setServices([...services, newService]);
        } catch (error: any) {
            LogApi.logError(error.toString(), service);
        }
    }

    function handleDeleteService(service: TService | null) {
        if (service != null) {
            ServiceApi.deleteService(service);
            setServices(services.filter((s) => s.id !== service.id));
        } else {
            LogApi.logError("Cannot delete service, because it is null", null);
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

    async function handleAcceptedNotification(booking: TBooking, color: string) {
        try {
            await BookingApi.deleteBooking(booking);
            setBookings(bookings.filter((b) => b.id !== booking.id));

            const newSession = await SessionApi.createSession({
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                clientName: booking.clientName,
                clientEmail: booking.clientEmail,
                clientPhone: booking.clientPhone,
                color: color,
            });
            setSessions([...sessions, newSession]);
        } catch (error: any) {
            LogApi.logError(error.toString(), booking);
        }
    }

    async function handleDeclinedNotification(booking: TBooking) {
        try {
            await BookingApi.deleteBooking(booking);
            setBookings(bookings.filter((b) => b.id !== booking.id));
        } catch (error: any) {
            LogApi.logError(error.toString(), booking);
        }
    }

    function handleUserEditUsernameChange(value: string) {
        setUserEdit({
            ...userEdit,
            username: value,
        })
    }

    function handleUserEditPasswordChange(value: string) {
        setUserEdit({
            ...userEdit,
            password: value,
        })
    }

    function handleUserEditPhoneNumberChange(value: string) {
        setUserEdit({
            ...userEdit,
            phoneNumber: value,
        })
    }

    async function handleUpdateUser(): Promise<boolean> {
        try {
            let hashedPassword = "";
            if (userEdit.password !== "") {
                hashedPassword = await CommonsHelper.hashPassword(userEdit.password);
            }

            const updatedUser = await UserApi.updateUser({
                ...userEdit,
                password: hashedPassword,
            });

            if (updatedUser) {
                setUserEdit({
                    ...userEdit,
                    password: "",
                });

                dispatch(updateUser({
                    username: updatedUser.username,
                    phoneNumber: updatedUser.phoneNumber,
                }))

                return true;
            }
        } catch (error: any) {
            LogApi.logError(error.toString(), userEdit);
            return false;
        }

        return false;
    }

    function logout() {
        dispatch(logoutUser());
        localStorage.removeItem('token');
        navigate("/login");
    }

    async function deleteProfile() {
        await UserApi.deleteUser();
        dispatch(logoutUser());
        localStorage.removeItem('token');
        navigate("/login");
    }

    function getTDayDateList(selectedWeek: TDay[]): Date[] {
        return selectedWeek.map((day) => day.date);
    }

    return (
        <>
            <Header
                notificationCount={bookings.length}
                qrButtonRef={qrButtonRef}
                notificationButtonRef={notificationButtonRef}
                settingsButtonRef={settingsButtonRef}
                rightSidebarContent={rightSidebarContent}
                onHeaderButtonClick={handleHeaderButtonClick}
                setCurrentWeek={setCurrentWeek}
            />
            <div className="flex">
                <Dialog
                    isDialogOpen={isConfirmProfileDeletionDialogOpen}
                    toggleDialog={toggleConfirmProfileDeletionDialog}
                >
                    <ConfirmProfileDeletion
                        handleDeleteProfile={deleteProfile}
                        handleToggleDialog={toggleConfirmProfileDeletionDialog}
                    />
                </Dialog>
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
                <Dialog
                    isDialogOpen={isAddServiceDialogOpen}
                    toggleDialog={toggleAddServiceDialog}
                >
                    <AddService
                        services={services}
                        handleAddService={handleCreateService}
                        handleDeleteService={handleDeleteService}
                    />
                </Dialog>
                <div ref={leftSidebarRef} className={`left-sidebar-container ${leftSidebarVisible ? "visible" : ""}`}>
                    <div className="content-display">
                        <CreateSessionButton handleToggleDialog={toggleCreateSessionDialog}/>
                        <WeeklyCalendar
                            selectedWeek={getTDayDateList(selectedWeek)}
                            handleSelectedWeek={handleSelectedWeek}
                        />
                        <AddServiceButton handleToggleDialog={toggleAddServiceDialog}/>
                    </div>
                </div>
                <div ref={rightSidebarRef}
                     className={`right-sidebar-container ${rightSidebarVisible ? "visible" : ""}`}>
                    <RightSidebar
                        content={rightSidebarContent}
                        services={services}
                        bookings={bookings}
                        handleAcceptedNotification={handleAcceptedNotification}
                        handleDeclinedNotification={handleDeclinedNotification}
                        userEdit={userEdit}
                        handleUserEditUsernameChange={handleUserEditUsernameChange}
                        handleUserEditPasswordChange={handleUserEditPasswordChange}
                        handleUserEditPhoneNumberChange={handleUserEditPhoneNumberChange}
                        handleUpdateUser={handleUpdateUser}
                        logout={logout}
                        toggleConfirmProfileDeletionDialog={toggleConfirmProfileDeletionDialog}
                    />
                </div>
                <div ref={hamburgerRef} className="hamburger-visibility">
                    <Hamburger
                        color={"#000000"}
                        toggled={leftSidebarVisible}
                        toggle={toggleSidebar}
                    />
                </div>
                <Calendar
                    highlightedRef={highlightedRef}
                    scrollableContainerRef={scrollableContainerRef}
                    scrollToHighlighted={scrollToHighlighted}
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