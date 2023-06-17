import React, {FormEvent, useEffect, useState} from 'react';
import {TService} from "../../types/TService";
import ServiceApi from "../../api/ServiceApi";
import {TSessionBookingProps} from "../../types/props/TSessionBookingProps";
import LogApi from "../../api/LogApi";
import {FaCheck, FaRegClock} from "react-icons/all";
import "../../SessionBooking.css";
import DailyCalendar from "./DailyCalendar";
import {TTimeSlot} from "../../types/TTimeSlot";
import TimeSlotApi from "../../api/TimeSlotApi";
import AvailableSessions from "./AvailableSessions";
import BookingApi from "../../api/BookingApi";
import {TBooking} from "../../types/TBooking";
import {TAvailableSession} from "../../types/TAvailableSession";
import ClientDetails from "./ClientDetails";
import {TClientDetails} from "../../types/TClientDetails";
import BookingDetails from "./BookingDetails";
import {TSession} from "../../types/TSession";
import SessionApi from "../../api/SessionApi";

function SessionBooking({id}: TSessionBookingProps) {
    // Form step state
    const [step, setStep] = useState<number>(1);

    // Services state
    const [services, setServices] = useState<TService[]>([]);

    // Time slots state
    const [timeSlots, setTimeSlots] = useState<TTimeSlot[]>([]);

    // Bookings state
    const [bookings, setBookings] = useState<TBooking[]>([]);

    // Sessions state
    const [sessions, setSessions] = useState<TSession[]>([]);

    // Selected service state
    const [selectedService, setSelectedService] = useState<TService | null>(null);

    // Selected available session state
    const [selectedAvailableSession, setSelectedAvailableSession] = useState<TAvailableSession | null>(null);

    // Error message state
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    // Booking message state
    const [bookingMessage, setBookingMessage] = useState<string | undefined>(undefined);

    // Booking state
    const [isBooked, setIsBooked] = useState<boolean>(false);

    // Selected day state
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());

    const [clientDetails, setClientDetails] = useState<TClientDetails>({
        clientName: "",
        clientSurname: "",
        clientEmail: "",
        clientPhone: "",
    });

    // Form step titles
    const steps = ['Select a Service', 'Select the Day and Available Time', 'Add your Details', 'Confirm Booking'];

    useEffect(() => {
        async function fetchServices() {
            const allServices = await ServiceApi.getServices(Number(id));
            setServices(allServices);
        }

        fetchServices().catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        fetchTimeSlots(new Date()).catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        fetchBookings(new Date()).catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        fetchSessions(new Date()).catch((error) => {
            LogApi.logError(error.toString(), null);
        });

    }, []);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step === 1 && !selectedService) {
            setErrorMessage('Please select a service before continuing.');
        } else if (step === 2 && !selectedAvailableSession) {
            setErrorMessage('Please select an available session before continuing.');
        } else if (step === 3 && (!clientDetails.clientName || !clientDetails.clientSurname || !clientDetails.clientEmail)) {
            setErrorMessage('Please fill in all required fields before continuing.');
        } else {
            setErrorMessage(undefined);
            if (step < 4) {
                setStep(step + 1);
            } else {
                if (selectedAvailableSession !== null && selectedService !== null) {
                    createBooking({
                        clientName: clientDetails.clientName + " " + clientDetails.clientSurname,
                        clientEmail: clientDetails.clientEmail,
                        clientPhone: clientDetails.clientPhone,
                        date: selectedAvailableSession.date,
                        startTime: selectedAvailableSession.startTime,
                        endTime: selectedAvailableSession.endTime,
                        userId: Number(id),
                        serviceId: selectedService.id,
                        timeSlotId: selectedAvailableSession.timeSlotId,
                    }).then((newBooking) => {
                        if (newBooking) {
                            setBookingMessage('Your booking has been confirmed');
                            setIsBooked(true);
                        }
                    }).catch((error) => {
                        LogApi.logError(error.toString(), null);
                        setErrorMessage('An error occurred while trying to book your session. Please try again later.')
                    });
                }
            }
        }
    };

    async function createBooking(booking: TBooking) {
        return await BookingApi.createBooking(booking);
    }

    async function fetchTimeSlots(date: Date) {
        const timeSlots = await TimeSlotApi.getTimeSlotsByDay(Number(id), date);
        setTimeSlots(timeSlots);
    }

    async function fetchBookings(date: Date) {
        const bookings = await BookingApi.getBookingsByDay(Number(id), date);
        setBookings(bookings);
    }

    async function fetchSessions(date: Date) {
        const sessions = await SessionApi.getSessionsByDay(Number(id), date);
        setSessions(sessions);
    }

    const goBack = () => {
        if (step > 1) {
            setErrorMessage(undefined);
            setStep(step - 1);
        }
    }

    function handleSelectedDay(day: Date) {
        const utcDay = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));

        fetchTimeSlots(utcDay).catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        fetchBookings(utcDay).catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        fetchSessions(utcDay).catch((error) => {
            LogApi.logError(error.toString(), null);
        });

        setSelectedDay(utcDay);
    }

    function handleSelectedAvailableSession(availableSession: TAvailableSession) {
        setSelectedAvailableSession(availableSession);
    }

    function handleClientNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setClientDetails({
            ...clientDetails,
            clientName: e.target.value,
        });
    }

    function handleClientSurnameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setClientDetails({
            ...clientDetails,
            clientSurname: e.target.value,
        });
    }

    function handleClientEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setClientDetails({
            ...clientDetails,
            clientEmail: e.target.value,
        });
    }

    function handleClientPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
        setClientDetails({
            ...clientDetails,
            clientPhone: e.target.value,
        });
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="w-full max-w-[1000px] p-6 m-4 bg-white rounded-md shadow-xl">
                <div className="form-progress flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <p className="font-light text-md uppercase">step: {step} of 4</p>
                        <h1 className="text-xl font-normal">{steps[step - 1]}</h1>
                    </div>
                    <div className="form-progress-bar">
                        <div className="w-full bg-gray-300 rounded-full h-2.5 mt-[10px]">
                            <div className="rounded-full bg-green-500 leading-none h-2.5 text-center text-white"
                                 style={{width: `${(step / steps.length) * 100}%`}}></div>
                        </div>
                        <span className="text-lg text-gray-700 ml-2">{Math.round((step / steps.length) * 100)}%</span>
                    </div>
                </div>

                <hr/>

                <form onSubmit={onSubmit} className="mt-6">
                    {errorMessage && (
                        <div className="mb-4 text-red-500 flex justify-center">{errorMessage}</div>
                    )}

                    {bookingMessage && (
                        <div className="mb-4 flex flex-col justify-center items-center text-green-600">
                            <p className="text-2xl font-normal mb-4">{bookingMessage}</p>
                            <div className="border-2 border-green-600 p-3 rounded-full"><FaCheck size={20} /></div>
                        </div>
                    )}

                    {step === 1 && !isBooked && (
                        <div className="flex flex-wrap justify-evenly">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => setSelectedService(service)}
                                    className={`data-card flex justify-between m-4 rounded-md text-gray-700 border border-gray-500
                                        ${selectedService === service ? 'bg-gray-300' : ''}
                                        hover:bg-gray-200 hover:scale-105 transition-all duration-100 cursor-pointer transform`}>
                                    <p className="p-2 font-normal mr-2 text-xl">{service.name}</p>
                                    <div className="flex justify-center p-2 items-center">
                                        <FaRegClock size={18} className="m-1"/>
                                        <span className="font-light text-lg">{service.length} min</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 2 && !isBooked && (
                        <div className="container-wrapper">
                            <div className="container">
                                <DailyCalendar
                                    selectedDay={selectedDay}
                                    handleSelectedDay={handleSelectedDay}
                                />
                            </div>
                            <div className="container">
                                <AvailableSessions
                                    timeSlots={timeSlots}
                                    bookings={bookings}
                                    sessions={sessions}
                                    selectedService={selectedService}
                                    selectedAvailableSession={selectedAvailableSession}
                                    handleSelectedAvailableSession={handleSelectedAvailableSession}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && !isBooked && (
                        <div className="flex justify-center">
                            <ClientDetails
                                clientDetails={clientDetails}
                                handleClientNameChange={handleClientNameChange}
                                handleClientSurnameChange={handleClientSurnameChange}
                                handleClientEmailChange={handleClientEmailChange}
                                handleClientPhoneChange={handleClientPhoneChange}
                            />
                        </div>
                    )}

                    {step === 4 && !isBooked && (
                        <div>
                            <BookingDetails
                                clientDetails={clientDetails}
                                selectedService={selectedService}
                                selectedAvailableSession={selectedAvailableSession}
                            />
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        {step !== 1 && !isBooked && (<button
                            className="px-4 py-2 text-blue-500 border border-blue-500 hover:bg-blue-100 rounded focus:outline-none
                            focus:shadow-outline transition duration-300 text-xl"
                            type="button" onClick={goBack} disabled={step === 1}>Previous</button>)}
                        {!isBooked && (<button
                            className="px-4 py-2 text-white bg-blue-500 hover:bg-indigo-500 hover:shadow-lg rounded focus:outline-none
                            focus:shadow-outline ml-3 transition duration-300 text-xl"
                            type="submit">{step < 4 ? 'Next' : 'Confirm'}</button>)}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SessionBooking;
