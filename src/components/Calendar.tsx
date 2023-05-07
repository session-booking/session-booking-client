import React, {useEffect, useState} from "react";
import {TDay} from "../types/TDay";
import {TCalendarProps} from "../types/props/TCalendarProps";
import SessionWindow from "./SessionWindow";
import {TSession} from "../types/TSession";
import {format} from "date-fns";
import {BsChevronCompactLeft, BsChevronCompactRight} from "react-icons/bs";
import {enUS} from "date-fns/locale";

function Calendar({selectedWeek, sessions, handleDeleteSession}: TCalendarProps) {
    const hours = Array.from({length: 24}, (_, i) => i);
    const quarterHours = Array.from({length: 96}, (_, i) => i);

    // Displayed days of the week state
    const [displayedDays, setDisplayedDays] = useState<TDay[]>([]);

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
        setDisplayedDays(updateDisplayedDays(selectedWeek));

        const handleResize = () => {
            updateDisplay();
            setDisplayedDays(updateDisplayedDays(selectedWeek));
        };

        window.addEventListener('resize', handleResize);

        // Cleanup code
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [selectedWeek]);

    function handleSessionClick(session: TSession, event: React.MouseEvent<HTMLDivElement>) {
        setClickedSession(session);
        setWindowVisible(true);
        setClickEvent(event);
    }

    function updateDisplay() {
        const width = window.innerWidth;
        const md = 768;
        const lg = 1024;

        const newDisplay = displayedDays.map((_, index) => {
            if (index >= 5 && width < lg) {
                return 'none';
            } else if (index >= 3 && width < md) {
                return 'none';
            }

            return 'grid';
        });

        setDisplay(newDisplay);
    }

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

                if (day.displayDate === format(sessionDate, 'P')) {
                    const start = convertToMinutes(session.startTime);
                    const end = convertToMinutes(session.endTime);

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

    function showNavigateLeftButton(index: number, date: Date): boolean {
        return (index == 0 && date.getTime() > selectedWeek[0].date.getTime());
    }

    function showNavigateRightButton(index: number, date: Date): boolean {
        const arrayLength = selectedWeek.length;
        return (index === displayedDays.length - 1 && date.getTime() < selectedWeek[arrayLength - 1].date.getTime());
    }

    return (
        <>
            <div className="w-full mt-5 mr-1">
                <div className="flex">
                    <div className="w-full">
                        <div className="w-full sticky top-0 z-10 bg-white">
                            <div className="grid calendar-grid">
                                <div className="col-span-1"></div>
                                {displayedDays.map((day, index) => (
                                    <div className="grid grid-cols-3 items-center">
                                        <div>
                                            {(showNavigateLeftButton(index, day.date))
                                                ? <button
                                                    onClick={() => handleNavigateDay(true)}
                                                    className="nav-button hover:bg-gray-200 active:bg-gray-300 rounded transition-colors duration-150 ease-in-out">
                                                    <BsChevronCompactLeft size={22}/> </button>
                                                : null}
                                        </div>

                                        <div key={String(day.displayDate)} style={{display: display[index]}} className="text-center">
                                            <div className="text-sm font-thin ml-0.5">{day.name}.</div>
                                            <div className="text-3xl font-thin pb-5">{getDateDay(day.displayDate)}</div>
                                        </div>

                                        <div className="justify-self-end">
                                            {(showNavigateRightButton(index, day.date))
                                                ? <button
                                                    onClick={() => handleNavigateDay(false)}
                                                    className="nav-button hover:bg-gray-200 active:bg-gray-300 rounded transition-colors duration-150 ease-in-out">
                                                    <BsChevronCompactRight size={22}/></button>
                                                : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid calendar-grid scrollable">
                            <div className="col-span-1">
                                {hours.map((hour) => (
                                    <div key={hour} className="h-16 flex justify-end">
                                        <span className="text-sm font-light">{hour}:00</span>
                                    </div>
                                ))}
                            </div>
                            {displayedDays.map((day, index) => (
                                <div key={String(day.displayDate)}
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