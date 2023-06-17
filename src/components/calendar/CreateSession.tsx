import React, {useState} from "react";
import {TCreateSessionProps} from "../../types/props/TCreateSessionProps";
import {TSession} from "../../types/TSession";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "./TimePicker";

function CreateSession({hideSidebar, handleCreate, handleToggleDialog}: TCreateSessionProps) {
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");

    const [session, setSession] = useState<TSession>({
        date: null,
        startTime: "00:00",
        endTime: "00:00",
        clientEmail: "",
        clientPhone: "",
        clientName: "",
        color: "#f59e0b",
    });

    async function handleCreateSession(e: React.FormEvent) {
        e.preventDefault();

        if (!validateSessionTime()) {
            setErrorMessage("Session end time must be after session start time.");
            return;
        }

        session.clientName = `${name} ${surname}`;
        handleCreate(session);

        setSession({
            date: null,
            startTime: "00:00",
            endTime: "00:00",
            clientEmail: "",
            clientPhone: "",
            clientName: "",
            color: "#f59e0b",
        });

        setErrorMessage(undefined);

        handleToggleDialog();
        hideSidebar();
    }

    function validateSessionTime() {
        return session.startTime < session.endTime;
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

    function handleColorValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSession({
            ...session,
            color: e.target.value,
        });
    }

    function handleClientEmailValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSession({
            ...session,
            clientEmail: e.target.value,
        });
    }

    function handleClientPhoneValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSession({
            ...session,
            clientPhone: e.target.value,
        });
    }

    function handleClientNameValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value);
    }

    function handleClientSurnameValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSurname(e.target.value);
    }

    return (
        <div className="p-4 max-w-md items-center">
            <div className="max-w-md">
                <form onSubmit={handleCreateSession}>
                    <div className="grid grid-cols-1 gap-6">
                        <h2 className="text-2xl font-light">Create a client session</h2>
                        {errorMessage && (
                            <div className="w-full">
                                <div className="text-red-500 flex justify-center">{errorMessage}</div>
                            </div>
                        )}
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
                            <div className="w-full px-3 mb-5 sm:w-1/2 sm:mb-0">
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
                        <div className="w-full">
                            <label className="text-black text-base font-light">
                                Select a color
                                <input
                                    value={session.color}
                                    onChange={handleColorValueChange}
                                    type="color"
                                    className="h-4 w-4 mt-1 float-left mr-2 cursor-pointer"
                                />
                            </label>
                        </div>
                        <div className="-mx-3 flex flex-wrap">
                            <div className="w-full px-3 mb-5 sm:w-1/2 sm:mb-0">
                                <label className="text-black text-base font-light">
                                    Name
                                    <input
                                        value={name}
                                        onChange={handleClientNameValueChange}
                                        type="text"
                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                                            font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                        placeholder="Client name"
                                        required
                                    />
                                </label>
                            </div>
                            <div className="w-full px-3 sm:w-1/2">
                                <label className="text-black text-base font-light">
                                    Surname
                                    <input
                                        value={surname}
                                        onChange={handleClientSurnameValueChange}
                                        type="text"
                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                                            font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                        placeholder="Client surname"
                                        required
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
                        <div className="w-full">
                            <label className="text-black text-base font-light">
                                Phone number
                                <input
                                    value={session.clientPhone}
                                    onChange={handleClientPhoneValueChange}
                                    type="tel"
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                                        font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    placeholder="Optional (9 digits)"
                                    pattern="[0-9]{9}"
                                />
                            </label>
                        </div>
                        <button
                            className="rounded-md bg-blue-500 hover:bg-blue-600 py-3 px-8 text-center
                                        text-base font-normal text-white outline-none w-full"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateSession;
