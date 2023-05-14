import React, {useState} from "react";
import {TCreateSessionProps} from "../types/props/TCreateSessionProps";
import {TSession} from "../types/TSession";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "./TimePicker";

function CreateSession({hideSidebar, handleCreate, handleToggleDialog}: TCreateSessionProps) {
    const [session, setSession] = useState<TSession>({
        date: null,
        open: false,
        startTime: "00:00",
        endTime: "00:00",
        clientEmail: "",
        clientName: "",
        color: "#f59e0b",
    });

    async function handleCreateSession(e: React.FormEvent) {
        e.preventDefault();

        // TODO: Validate session data

        handleCreate(session);

        setSession({
            date: null,
            open: false,
            startTime: "00:00",
            endTime: "00:00",
            clientEmail: "",
            clientName: "",
            color: "#f59e0b",
        });

        handleToggleDialog();
        hideSidebar();
    }

    function handleDayValueChange(date: Date) {
        setSession({
            ...session,
            date: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
        });
    }

    function handleStartTimeValueChange(time: string) {
        setSession({
            ...session,
            startTime: time,
        });
    }

    function handleEndTimeValueChange(time: string) {
        setSession({
            ...session,
            endTime: time,
        });
    }

    function handleOpenValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {checked} = e.target;
        setSession({
            ...session,
            open: checked,
        });
    }

    function handleClientEmailValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSession({
            ...session,
            clientEmail: e.target.value,
        });
    }

    function handleColorValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSession({
            ...session,
            color: e.target.value,
        });
    }

    return (
        <div className="p-4 max-w-md items-center">
            <div className="max-w-md">
                <form onSubmit={handleCreateSession}>
                    <div className="grid grid-cols-1 gap-6">
                        <h2 className="text-2xl font-light">Create a client session</h2>
                        <div className="w-full">
                            <label className="text-black text-base font-light">
                                Session date
                                <DatePicker
                                    selected={session.date}
                                    onChange={handleDayValueChange}
                                    dateFormat="dd.MM.yyyy"
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                                        font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    calendarStartDay={1}
                                    required
                                />
                            </label>
                        </div>
                        <div className="-mx-3 flex flex-wrap">
                            <div className="w-full px-3 sm:w-1/2">
                                <label className="text-black text-base font-light">
                                    Start time
                                    <TimePicker
                                        value={session.startTime}
                                        onChange={handleStartTimeValueChange}
                                    />
                                </label>
                            </div>
                            <div className="w-full px-3 sm:w-1/2">
                                <label className="text-black text-base font-light">
                                    End time
                                    <TimePicker
                                        value={session.endTime}
                                        onChange={handleEndTimeValueChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="-mx-3 flex flex-wrap">
                            <div className="w-full px-3 sm:w-1/2">
                                <label className="text-black text-base font-light">
                                    Is the session open?
                                    <input
                                        checked={session.open}
                                        onChange={handleOpenValueChange}
                                        type="checkbox"
                                        className="h-4 w-4 mt-1 float-left mr-2 cursor-pointer"
                                    />
                                </label>
                            </div>
                            <div className="w-full px-3 sm:w-1/2">
                                <label className="text-black text-base font-light">
                                    Pick color
                                    <input
                                        value={session.color}
                                        onChange={handleColorValueChange}
                                        type="color"
                                        className="h-4 w-4 mt-1 float-left mr-2 cursor-pointer"
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="w-full">
                            <label className="text-black text-base font-light">
                                Email
                                <input
                                    value={session.clientEmail}
                                    onChange={handleClientEmailValueChange}
                                    type="email"
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base 
                                        font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    placeholder="example@address.com"
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <button
                                className="rounded-md bg-blue-500 hover:bg-blue-600 py-3 px-8 text-center
                                        text-base font-normal text-white outline-none"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateSession;
