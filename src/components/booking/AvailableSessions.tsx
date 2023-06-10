import {TAvailableSessionsProps} from "../../types/props/TAvailableSessionsProps";
import {BsDot} from "react-icons/all";
import React from "react";
import {TAvailableSession} from "../../types/TAvailableSession";

function AvailableSessions({timeSlots, bookings, selectedService, selectedAvailableSession, handleSelectedAvailableSession}: TAvailableSessionsProps) {

    const availableSessions = getAvailableSessions();

    function getAvailableSessions(): TAvailableSession[] {
        let availableSessions: TAvailableSession[] = [];

        for (const timeSlot of timeSlots) {
            const timeSlotMin = calculateInterval(timeSlot.startTime, timeSlot.endTime);

            let bookingsMinSum = 0;
            for (const booking of bookings) {
                if (timeSlot.id === booking.timeSlotId) {
                    const bookingMin = calculateInterval(booking.startTime, booking.endTime);
                    bookingsMinSum = bookingsMinSum + bookingMin;
                }
            }

            const availableTime = timeSlotMin - bookingsMinSum;
            if (selectedService != null && availableTime >= selectedService.length) {
                availableSessions.push({
                    startTime: addMinutesToTime(timeSlot.startTime, bookingsMinSum),
                    endTime: addMinutesToTime(timeSlot.startTime, bookingsMinSum + selectedService.length),
                    date: timeSlot.date,
                    timeSlotId: timeSlot.id
                });
            }
        }

        return availableSessions;
    }

    function calculateInterval(startTime: string, endTime: string) {
        const start = new Date();
        const end = new Date();

        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);

        start.setHours(startHour, startMinute);
        end.setHours(endHour, endMinute);

        const diffInMilliseconds = end.getTime() - start.getTime();
        return diffInMilliseconds / (1000 * 60)
    }

    function addMinutesToTime(time: string, minutes: number) {
        const [hour, minute] = time.split(":").map(Number);
        const date = new Date();

        date.setHours(hour, minute);
        date.setMinutes(date.getMinutes() + minutes);

        const newHour = date.getHours().toString().padStart(2, '0');
        const newMinute = date.getMinutes().toString().padStart(2, '0');

        return `${newHour}:${newMinute}`;
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