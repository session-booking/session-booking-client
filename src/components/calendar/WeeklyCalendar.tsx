import {useState} from "react";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";
import {TWeeklyCalendarProps} from "../../types/props/TWeeklyCalendarProps";
import {CalendarHelper} from "../../helpers/CalendarHelper";

function WeeklyCalendar({handleSelectedWeek}: TWeeklyCalendarProps) {

    // Current year and month
    const [year, setYear] = useState(CalendarHelper.getCurrentYear());
    const [month, setMonth] = useState(CalendarHelper.getCurrentMonth());

    // Weeks in the current month
    const weeks = CalendarHelper.getAllDaysInCurrentMonth(year, month);

    const isCurrentWeek = (week: Date[]) => {
        return week.some(CalendarHelper.isToday);
    };

    // Selected week
    const [selectedWeek, setSelectedWeek] = useState(getDefaultWeek());

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

    return (
        <div className="mt-5 bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
                <p className="text-md font-light pl-2 pb-2">{CalendarHelper.getMonthName(month)} {year}</p>
                <div className="flex mb-2">
                    <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setMonthAndYear(month - 1)}>
                        <FiChevronLeft/></button>
                    <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setMonthAndYear(month + 1)}>
                        <FiChevronRight/></button>
                </div>
            </div>
            <table className="w-full text-center table-fixed">
                <thead>
                <tr className="font-semibold text-gray-500 uppercase">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <th key={index} className="w-1/7 py-1 text-[14px]">
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
                                            } text-[14px] py-1`}
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

export default WeeklyCalendar;