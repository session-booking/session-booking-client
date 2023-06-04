import {useState} from "react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {TMonthlyCalendarProps} from "../../types/props/TMonthlyCalendarProps";

function MonthlyCalendar({handleSelectedWeek}: TMonthlyCalendarProps) {

    // Current year and month
    const [year, setYear] = useState(getCurrentYear());
    const [month, setMonth] = useState(getCurrentMonth());

    // Weeks in the current month
    const weeks = getAllDaysInCurrentMonth(year, month);

    const isToday = (day: Date) => {
        const today = new Date();
        return (
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear()
        );
    };

    const isCurrentWeek = (week: Date[]) => {
        return week.some(isToday);
    };

    // Selected week
    const [selectedWeek, setSelectedWeek] = useState(getDefaultWeek());

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const isSelectedWeek = (week: Date[]) => {
        if (selectedWeek !== undefined) {
            return week[0].getTime() === selectedWeek[0].getTime();
        }
        return false;
    }

    function getDefaultWeek() {
        for (let i = 0; i < weeks.length; i++) {
            if (isCurrentWeek(weeks[i])) {
                return weeks[i];
            }
        }
    }

    function handleWeekSelection(week: Date[]) {
        handleSelectedWeek(week);
        setSelectedWeek(week);
    }

    function setMonthAndYear(month: number) {
        if (month < 0) {
            setYear(year - 1);
            setMonth(11);
        } else if (month > 11) {
            setYear(year + 1);
            setMonth(0);
        } else {
            setMonth(month);
        }
    }

    function getMonthName(month: number) {
        return months[month];
    }

    function getCurrentYear() {
        const date = new Date();
        return date.getFullYear();
    }

    function getCurrentMonth() {
        const date = new Date();
        return date.getMonth();
    }

    function getAllDaysInCurrentMonth(year: number, month: number) {
        const weeks = [];

        const firstDay = new Date(year, month, 1);
        const firstDayWeekDay = (firstDay.getDay() + 6) % 7;

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const startDay = prevMonthLastDay - firstDayWeekDay + 1;

        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                week.push(new Date(year, month - 1, startDay + i * 7 + j));
            }
            weeks.push(week);
        }

        return weeks;
    }

    return (
        <div className="monthly-calendar mt-5 bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
                <p className="text-md font-light pl-2 pb-2">{getMonthName(month)} {year}</p>
                <div className="flex mb-2">
                    <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setMonthAndYear(month - 1)}> <FiChevronLeft/> </button>
                    <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setMonthAndYear(month + 1)}> <FiChevronRight/> </button>
                </div>
            </div>
            <table className="w-full text-center table-fixed">
                <thead>
                <tr className="text-xs font-semibold text-gray-500 uppercase">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <th key={index} className="w-1/7 py-1 text-[11px]">
                            {day}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {weeks.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                        <td colSpan={7} className="p-0">
                            <button
                                onClick={() => handleWeekSelection(week)}
                                className={`w-full py-1 rounded transition-all duration-200 ease-in-out transform ${
                                    isSelectedWeek(week)
                                        ? 'bg-blue-100 hover:bg-blue-200'
                                        : 'hover:bg-gray-100'
                                } hover:scale-105`}
                            >
                                <div className="flex">
                                    {week.map((day, dayIndex) => (
                                        <span
                                            key={dayIndex}
                                            className={`flex-1 ${
                                                day.getMonth() !== month
                                                    ? 'text-gray-300'
                                                    : 'text-gray-700'
                                            } text-[11px] py-1`}
                                        >
                                            {day.getDate()}
                                        </span>
                                    ))}
                                </div>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MonthlyCalendar;