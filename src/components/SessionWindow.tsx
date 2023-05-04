import React, {useEffect, useRef} from "react";
import {TSessionWindowProp} from "../types/props/TSessionWindowProp";
import {MdDeleteForever, MdEdit} from "react-icons/md";
import {TSession} from "../types/TSession";

function SessionWindow({session, visible, onClose, clickEvent, handleDeleteSession}: TSessionWindowProp) {
    const infoWindowRef = useRef<HTMLDivElement>(null);

    const calculateWindowPosition = () => {
        if (!clickEvent) return {top: 0, right: 0, left: "auto"};

        const buffer = 10; // Space between the clicked element and the info window
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const halfWindowWidth = windowWidth / 2;
        const halfWindowHeight = windowHeight / 2;
        const clickX = clickEvent.clientX;
        const clickY = clickEvent.clientY;

        const windowSize = 256; // Width of the shown window

        if (windowWidth <= 768) {
            return {
                top: clickY + buffer,
                left: (windowWidth - windowSize) / 2,
                right: "auto",
                bottom: "auto",
            };
        } else {
            if (clickX <= halfWindowWidth && clickY <= halfWindowHeight) {
                return {
                    top: clickY + buffer,
                    left: clickX + buffer,
                    right: "auto",
                    bottom: "auto",
                };
            } else if (clickX > halfWindowWidth && clickY <= halfWindowHeight) {
                return {
                    top: clickY + buffer,
                    left: "auto",
                    right: windowWidth - clickX + buffer,
                    bottom: "auto",
                };
            } else if (clickX <= halfWindowWidth && clickY > halfWindowHeight) {
                return {
                    top: "auto",
                    left: clickX + buffer,
                    right: "auto",
                    bottom: windowHeight - clickY + buffer,
                };
            } else {
                return {
                    top: "auto",
                    left: "auto",
                    right: windowWidth - clickX + buffer,
                    bottom: windowHeight - clickY + buffer,
                };
            }
        }
    };

    const windowPosition = calculateWindowPosition();

    // Dependency is onClose, so this effect will run when onClose changes and when the component mounts
    useEffect(() => {
        // If current is not null and the target of the click is not inside the infoWindowRef, then call onClose
        function handleClickOutside(event: MouseEvent) {
            if (infoWindowRef.current && !infoWindowRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [onClose]);

    function handleDeleteSessionButtonClick(session: TSession | null) {
        handleDeleteSession(session);
        onClose();
    }

    function formatDate(date: Date) {
        const sessionDate = new Date(date);

        const year = sessionDate.getFullYear();
        const month = ('0' + (sessionDate.getMonth() + 1)).slice(-2);
        const day = ('0' + sessionDate.getDate()).slice(-2);

        return `${day}. ${month}. ${year}`;
    }

    return (
        <div
            ref={infoWindowRef}
            className={`fixed p-4 bg-white rounded-lg shadow-lg ${visible ? "scale-100" : "scale-0"} transition-all duration-300 ease-in-out sm:w-64 sm:text-lg md:w-72 md:text-xl`}
            style={{
                transformOrigin: "center",
                zIndex: 10,
                ...windowPosition,
            }}
        >
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-normal mb-2 sm:text-2xl">Session Info</h3>
                <div className="flex mt-1">
                    <button className="focus:outline-none pl-2">
                        <MdEdit className="edit-icon"/>
                    </button>
                    <button className="focus:outline-none" onClick={() => handleDeleteSessionButtonClick(session)}>
                        <MdDeleteForever className="delete-icon"/>
                    </button>
                </div>
            </div>
            {session && (
                <div>
                    {(session.date !== null) ?
                        <div className="flex">
                            <p className="text-base font-normal sm:text-lg">Date:&nbsp;</p>
                            <p className="text-base font-light sm:text-lg">{formatDate(session.date)}</p>
                        </div> : null}
                    <div className="flex">
                        <p className="text-base font-normal sm:text-lg">Time:&nbsp;</p>
                        <p className="text-base font-light sm:text-lg">{session.startTime} - {session.endTime}</p>
                    </div>
                    <div className="flex">
                        <p className="text-base font-normal sm:text-lg">Email:&nbsp;</p>
                        <p className="text-base font-light sm:text-lg">{session.clientEmail}</p>
                    </div>
                </div>
            )}
        </div>
    );

}

export default SessionWindow;