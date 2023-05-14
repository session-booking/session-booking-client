import React, {useState} from 'react';
import {TransitionGroup, CSSTransition} from 'react-transition-group';
import {TSetTimeSlotsProps} from "../types/props/TSetTimeSlotsProps";
import TimePicker from "./TimePicker";
import {AiOutlineMinusCircle} from 'react-icons/ai';
import {TTimeSlot} from "../types/TTimeSlot";

function SetTimeSlots({selectedDay, timeSlots, handleCreateTimeSlot, handleDeleteTimeSlot}: TSetTimeSlotsProps) {
    const [timeSlot, setTimeSlot] = useState<TTimeSlot>({
        date: (selectedDay?.date != undefined) ? selectedDay?.date : null,
        startTime: "00:00",
        endTime: "00:00",
    });

    const handleAddTimeSlot = () => {
        handleCreateTimeSlot(timeSlot);

        setTimeSlot({
            ...timeSlot,
            startTime: "00:00",
            endTime: "00:00",
        })
    };

    const handleRemoveTimeSlot = (timeSlot: TTimeSlot) => {
        handleDeleteTimeSlot(timeSlot);
    };

    function formatDate(date: Date | undefined) {
        if (date) {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            return `, ${day < 10 ? '0' + day : day}. ${month < 10 ? '0' + month : month}.`;
        }
    }

    function formatDayName(dayName: string | undefined) {
        if (dayName) {
            switch (dayName) {
                case "Mon":
                    return "Monday";
                case "Tue":
                    return "Tuesday";
                case "Wed":
                    return "Wednesday";
                case "Thu":
                    return "Thursday";
                case "Fri":
                    return "Friday";
                case "Sat":
                    return "Saturday";
                case "Sun":
                    return "Sunday";
                default:
                    return "";
            }
        }
    }

    function handleStartTimeValueChange(time: string) {
        setTimeSlot({
            ...timeSlot,
            startTime: time,
        });
    }

    function handleEndTimeValueChange(time: string) {
        setTimeSlot({
            ...timeSlot,
            endTime: time,
        });
    }

    return (
        <div className="p-4 max-w-xl items-center">
            <div className="max-w-xl">
                <div className="time-slot-dialog flex flex-col justify-center">
                    <h3 className="text-md font-thin">{formatDayName(selectedDay?.name)}{formatDate(selectedDay?.date)}</h3>
                    <h2 className="text-2xl font-light mb-4">Set time slots for client booking</h2>
                    <div className="flex flex-col justify-between items-center">
                        <div className="flex flex-row justify-between items-center w-full">
                            <label className="mr-2 w-full font-light">
                                Start Time
                                <TimePicker
                                    value={timeSlot.startTime}
                                    onChange={handleStartTimeValueChange}
                                />
                            </label>
                            <label className="w-full font-light">
                                End Time
                                <TimePicker
                                    value={timeSlot.endTime}
                                    onChange={handleEndTimeValueChange}
                                />
                            </label>
                        </div>
                        <button onClick={handleAddTimeSlot}
                                className="bg-blue-500 text-white rounded p-2 mt-4 w-full flex justify-center">
                            Add time slot
                        </button>
                    </div>
                    <TransitionGroup>
                        {timeSlots.map((timeSlot, index) => (
                            <CSSTransition key={index} timeout={300} classNames="item">
                                <div
                                    className="flex flex-row justify-between items-center mt-2 bg-white rounded-lg shadow-md p-3">
                                    <div className="flex justify-evenly w-full">
                                        <div>
                                            <span className="font-normal text-lg">Start: </span>
                                            <span className="font-thin text-lg">{timeSlot.startTime}</span>
                                        </div>
                                        <div>
                                            <span className="font-normal text-lg">End: </span>
                                            <span className="font-thin text-lg">{timeSlot.endTime}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemoveTimeSlot(timeSlot)} className="text-red-500">
                                        <AiOutlineMinusCircle size={24}/>
                                    </button>
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </div>
            </div>
        </div>
    );
}

export default SetTimeSlots;
