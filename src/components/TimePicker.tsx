import React from "react";
import {TTimePickerProp} from "../types/props/TTimePickerProp";

function TimePicker({value, onChange}: TTimePickerProp) {
    const quarterHours = Array.from({length: 96}, (_, i) => i * 15);

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    return (
        <select value={value} onChange={onChange} required={true}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md">
            {quarterHours.map((minutes) => (
                <option key={minutes} value={formatTime(minutes)} className="font-normal">
                    {formatTime(minutes)}
                </option>
            ))}
        </select>
    );
}

export default TimePicker;