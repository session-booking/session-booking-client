export class CalendarHelper {

    static months = [
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

    static isToday = (day: Date) => {
        const today = new Date();
        return (
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear()
        );
    };

    static getMonthName(month: number) {
        return this.months[month];
    }

    static getCurrentYear() {
        const date = new Date();
        return date.getFullYear();
    }

    static getCurrentMonth() {
        const date = new Date();
        return date.getMonth();
    }

    static getAllDaysInCurrentMonth(year: number, month: number) {
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

}