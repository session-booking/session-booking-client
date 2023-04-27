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

        if (clickX <= halfWindowWidth && clickY <= halfWindowHeight) {
            return {
                top: clickY + buffer,
                left: clickX + buffer,
                right: "auto",
                bottom: "auto"
            };
        } else if (clickX > halfWindowWidth && clickY <= halfWindowHeight) {
            return {
                top: clickY + buffer,
                left: "auto",
                right: windowWidth - clickX + buffer,
                bottom: "auto"
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
            className={`fixed w-64 p-4 bg-white rounded-lg shadow-lg ${visible ? "scale-100" : "scale-0"} transition-all duration-300 ease-in-out`}
            style={{
                transformOrigin: "center",
                zIndex: 10,
                ...windowPosition,
            }}
        >
            <div className="flex justify-between items-start">
                <h3 className="text-2xl font-normal mb-2">Session Info</h3>
                <div className="flex">
                    <button className="focus:outline-none pr-2">
                        <MdEdit size={24}/>
                    </button>
                    <button className="focus:outline-none" onClick={() => handleDeleteSessionButtonClick(session)}>
                        <MdDeleteForever color={"#d11a2a"} size={24}/>
                    </button>
                </div>
            </div>
            {session && (
                <div>
                    {(session.date !== null) ?
                        <div className="flex">
                            <p className="text-lg font-normal">Date:&nbsp;</p>
                            <p className="text-lg font-light">{formatDate(session.date)}</p>
                        </div> : null}
                    <div className="flex">
                        <p className="text-lg font-normal">Time:&nbsp;</p>
                        <p className="text-lg font-light">{session.start_time} - {session.end_time}</p>
                    </div>
                    <div className="flex">
                        <p className="text-lg font-normal">Email:&nbsp;</p>
                        <p className="text-lg font-light">{session.client_email}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SessionWindow;