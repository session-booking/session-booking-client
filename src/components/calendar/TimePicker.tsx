import React, {useState, useRef, useEffect} from 'react';
import {TTimePickerProps} from '../../types/props/TTimePickerProps';

function TimePicker({value, onChange}: TTimePickerProps) {
    const quarterHours = Array.from({length: 96}, (_, i) => i * 15);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    const handleClick = (time: string) => {
        onChange(time);
    }

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                font-light text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            >
                {value || 'Select a time'}
            </button>
            {isOpen && (
                <div
                    className="absolute w-full rounded-md border border-[#e0e0e0] bg-white py-1 z-10 overflow-auto max-h-56">
                    {quarterHours.map((minutes) => (
                        <div
                            key={minutes}
                            onClick={() => handleClick(formatTime(minutes))}
                            className="cursor-pointer hover:bg-blue-100 px-6 py-2"
                        >
                            {formatTime(minutes)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TimePicker;