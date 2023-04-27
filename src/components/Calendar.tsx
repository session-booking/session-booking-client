import React, {useEffect, useState} from "react";
import {TDay} from "../types/TDay";
import {TCalendarProps} from "../types/props/TCalendarProps";
import SessionWindow from "./SessionWindow";
import {TSession} from "../types/TSession";

function Calendar({days, sessions, handleDeleteSession}: TCalendarProps) {
    const hours = Array.from({length: 24}, (_, i) => i);
    const quarterHours = Array.from({length: 96}, (_, i) => i);

    // Calendar state
    const [display, setDisplay] = useState<Array<string>>([]);

    // Session window state
    const [clickedSession, setClickedSession] = useState<TSession | null>(null);
    const [windowVisible, setWindowVisible] = useState<boolean>(false);
    const [clickEvent, setClickEvent] = useState<React.MouseEvent<HTMLDivElement> | null>(null);

    const handleWindowClose = () => {
        setWindowVisible(false);
    };

    useEffect(() => {
        updateDisplay();

        const handleResize = () => {
            updateDisplay();
        };

        window.addEventListener('resize', handleResize);

        // Cleanup code
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [days, sessions]);

    function handleSessionClick(session: TSession, event: React.MouseEvent<HTMLDivElement>) {
        setClickedSession(session);
        setWindowVisible(true);
        setClickEvent(event);
    }

    function updateDisplay() {
        const width = window.innerWidth;
        const md = 768;
        const lg = 1024;

        const newDisplay = days.map((_, index) => {
            if (index >= 5 && width < lg) {
                return 'none';
            } else if (index >= 3 && width < md) {
                return 'none';
            }

            return 'grid';
        });

        setDisplay(newDisplay);
    }

    function getDateDay(date: string) {
        const day = date.split("/")[1];
        return Number(day);
    }

    function convertToMinutes(time: string) {
        const [hours, minutes] = time.split(":");
        return Number(hours) * 60 + Number(minutes);
    }

    function renderSessions(day: TDay) {
        return sessions.map((session) => {

            if (session.date !== null) {
                const sessionDate = new Date(session.date);

                if (day.date === sessionDate.toLocaleDateString()) {
                    const start = convertToMinutes(session.start_time);
                    const end = convertToMinutes(session.end_time);

                    const top = (start / 15) * 16;
                    const height = ((end - start) / 15) * 16;

                    return (
                        <div
                            key={`${session.id}`}
                            className="w-full z-5 rounded cursor-pointer animated-shadow"
                            style={{
                                position: "absolute",
                                top: `${top}px`,
                                height: `${height}px`,
                                backgroundColor: session.color
                            }}
                            onClick={(event) => handleSessionClick(session, event)}
                            tabIndex={0}
                        ></div>
                    );
                }

                return null;
            }
        });
    }

    return (
        <>
            <div className="w-full mt-5">
                <div className="flex">
                    <div className="w-full scrollable">
                        <div className="w-full sticky top-0 z-10 bg-white">
                            <div className="grid calendar-grid">
                                <div className="col-span-1"></div>
                                {days.map((day, index) => (
                                    <div key={String(day.date)} style={{display: display[index]}}>
                                        <div className="text-sm font-thin ml-0.5">{day.name}.</div>
                                        <div className="text-3xl font-thin pb-5">{getDateDay(day.date)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid calendar-grid">
                            <div className="col-span-1">
                                {hours.map((hour) => (
                                    <div key={hour} className="h-16 flex justify-end">
                                        <span className="text-sm font-light">{hour}:00</span>
                                    </div>
                                ))}
                            </div>
                            {days.map((day, index) => (
                                <div key={String(day.date)}
                                     className="col-span-1 mt-3"
                                     style={{display: display[index]}}
                                >
                                    <div className="relative">
                                        {quarterHours.map((quarter, index) => {
                                            const getTime = (index: number) => {
                                                const minutes = (index + 1) * 15;
                                                const hours = Math.floor(minutes / 60);
                                                const remainingMinutes = minutes % 60;

                                                return `${hours}-${remainingMinutes}`;
                                            };

                                            const getQuarterClasses = (index: number) => {
                                                const isFirst = index === 0;
                                                const isEveryFourth = (index + 1) % 4 === 0;

                                                let timeClass = `${getTime(index)}`
                                                let styleClasses = isFirst
                                                    ? 'h-16/4 bg-white border-t border-gray-400' : isEveryFourth
                                                        ? 'h-16/4 bg-white border-b border-gray-400' : 'h-16/4 bg-white';

                                                return `${timeClass} ${styleClasses}`;
                                            };

                                            return (
                                                <div
                                                    key={`${day}-${quarter}`}
                                                    className={getQuarterClasses(index)}
                                                ></div>
                                            );
                                        })}

                                        {renderSessions(day)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <SessionWindow
                session={clickedSession}
                visible={windowVisible}
                onClose={handleWindowClose}
                clickEvent={clickEvent}
                handleDeleteSession={handleDeleteSession}
            />
        </>
    );
}

export default Calendar;