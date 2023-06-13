import {TAvailableSessionsProps} from "../../types/props/TAvailableSessionsProps";
import {BsDot} from "react-icons/all";
import React from "react";
import {TAvailableSession} from "../../types/TAvailableSession";

function AvailableSessions({timeSlots, bookings, sessions, selectedService, selectedAvailableSession, handleSelectedAvailableSession}: TAvailableSessionsProps) {

    const availableSessions = getAvailableSessions();

    function getAvailableSessions(): TAvailableSession[] {
        let availableSessions: TAvailableSession[] = [];

        for (const timeSlot of timeSlots) {
            const timeSlotStartMin = timeToMinutes(timeSlot.startTime);
            const timeSlotEndMin = timeToMinutes(timeSlot.endTime);
            const serviceLength = selectedService != null ? selectedService.length : 0;

            let busyMinutes = new Set<number>();

            for (const booking of bookings) {
                if (timeSlot.id === booking.timeSlotId) {
                    const bookingStartMin = timeToMinutes(booking.startTime);
                    const bookingEndMin = timeToMinutes(booking.endTime);
                    for (let i = bookingStartMin; i < bookingEndMin; i++) {
                        busyMinutes.add(i);
                    }
                }
            }

            for (const session of sessions) {
                const sessionStartMin = timeToMinutes(session.startTime);
                const sessionEndMin = timeToMinutes(session.endTime);
                for (let i = sessionStartMin; i < sessionEndMin; i++) {
                    if (i >= timeSlotStartMin && i < timeSlotEndMin) {
                        busyMinutes.add(i);
                    }
                }
            }

            let currentStartMin = timeSlotStartMin;
            while (currentStartMin + serviceLength <= timeSlotEndMin) {
                let isFree = true;
                for (let i = 0; i < serviceLength; i++) {
                    if (busyMinutes.has(currentStartMin + i)) {
                        isFree = false;
                        currentStartMin += i + 1;
                        break;
                    }
                }
                if (isFree) {
                    availableSessions.push({
                        startTime: minutesToTime(currentStartMin),
                        endTime: minutesToTime(currentStartMin + serviceLength),
                        date: timeSlot.date,
                        timeSlotId: timeSlot.id
                    });
                    break;
                }
            }
        }

        return availableSessions;
    }


    function timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }

    function minutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    function isSessionSelected(availableSession: TAvailableSession) {
        if (selectedAvailableSession != null) {
            return selectedAvailableSession.startTime === availableSession.startTime &&
                selectedAvailableSession.endTime === availableSession.endTime &&
                selectedAvailableSession.date === availableSession.date;
        }
        return false;
    }

    return (
        <div className="flex flex-col justify-center items-center">
            {availableSessions.map((availableSession, index) => (
                <button
                    type="button"
                    onClick={() => handleSelectedAvailableSession(availableSession)}
                    key={index}
                    className={`data-card flex flex-row justify-center m-3 p-2 rounded-md border border-gray-500 hover:bg-gray-200
                        ${isSessionSelected(availableSession) ? 'bg-gray-300' : ''}
                        hover:scale-105 transition-all duration-100 cursor-pointer transform`}
                >
                    <p className="text-[22px] font-thin">
                        <span className="font-light">Start time: </span>{availableSession.startTime}
                    </p>
                    <BsDot size={24} className="m-1.5"/>
                    <p className="text-[22px] font-thin">
                        <span className="font-light">End time: </span>{availableSession.endTime}
                    </p>
                </button>
            ))}
        </div>
    );
}

export default AvailableSessions;