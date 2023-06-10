import {TDailyCalendarProps} from "../../types/props/TDailyCalendarProps";
import {CalendarHelper} from "../../helpers/CalendarHelper";
import {useEffect, useState} from "react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {isBefore, isSameDay} from "date-fns";

function DailyCalendar({selectedDay, handleSelectedDay}: TDailyCalendarProps) {
    const initialYear = CalendarHelper.getCurrentYear();
    const initialMonth = CalendarHelper.getCurrentMonth();
    const initialDate = new Date().getDate();

    // Current year and month
    const [year, setYear] = useState(initialYear);
    const [month, setMonth] = useState(initialMonth);

    const [isPrevMonthAvailable, setIsPrevMonthAvailable] = useState(false);

    useEffect(() => {
        setIsPrevMonthAvailable(!(year === initialYear && month === initialMonth));
    }, [year, month, initialYear, initialMonth]);

    const weeks = CalendarHelper.getAllDaysInCurrentMonth(year, month);

    function handleDaySelection(day: Date) {
        if (isBefore(day, new Date(initialYear, initialMonth, initialDate))) {
            return;
        }
        handleSelectedDay(day);
    }

    function setMonthAndYear(month: number) {
        if (month < 0) {
            if (year === initialYear) {
                return;
            }
            setYear(year - 1);
            setMonth(11);
        } else if (month > 11) {
            setYear(year + 1);
            setMonth(0);
        } else {
            setMonth(month);
        }
    }

    return (
        <div className="bg-white">
            <div className="flex justify-between items-center">
                <p className="text-xl font-light pl-2 pb-2">{CalendarHelper.getMonthName(month)} {year}</p>
                <div className="flex mb-2">
                    <button
                        type="button"
                        className={`p-1 rounded-full ${!isPrevMonthAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                        onClick={() => isPrevMonthAvailable && setMonthAndYear(month - 1)}
                        disabled={!isPrevMonthAvailable}
                    >
                        <FiChevronLeft size={20}/>
                    </button>
                    <button
                        type="button"
                        className="p-1 rounded-full hover:bg-gray-100"
                        onClick={() => setMonthAndYear(month + 1)}>
                        <FiChevronRight size={20}/>
                    </button>
                </div>
            </div>
            <table className="w-full text-center table-fixed">
                <thead>
                <tr className="font-normal text-gray-500 uppercase">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <th key={index} className="w-1/7 py-1 text-[20px]">
                            {day}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {weeks.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                        <td colSpan={7} className="p-0">
                            <div className="flex">
                                {week.map((day, dayIndex) => (
                                    <button
                                        type="button"
                                        key={dayIndex}
                                        onClick={() => handleDaySelection(day)}
                                        className={`flex-1 w-1 h-auto ${
                                            isSameDay(day, selectedDay)
                                                ? 'bg-blue-100'
                                                : day.getMonth() !== month && !isBefore(day, new Date(initialYear, initialMonth, initialDate))
                                                    ? 'text-gray-300 hover:bg-gray-100'
                                                    : day.getMonth() !== month || isBefore(day, new Date(initialYear, initialMonth, initialDate))
                                                        ? 'text-gray-300 hover:bg-gray-100 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                        } text-[20px] font-thin py-1 rounded-full hover:scale-110 transition-all 
                                        duration-100 transform`}
                                        disabled={day.getMonth() === month && isBefore(day, new Date(initialYear, initialMonth, initialDate))}
                                    >
                                        {day.getDate()}
                                    </button>
                                ))}

                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default DailyCalendar;