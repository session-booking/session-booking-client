import {TTimeSlot} from "../types/TTimeSlot";
import {API_URL} from "./config/config";
import LogApi from "./LogApi";
import {format} from "date-fns";

class TimeSlotApi {

    public async getTimeSlotsByDateInterval(fromDate: Date, toDate: Date): Promise<TTimeSlot[]> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        const fromDateString = format(fromDate, 'yyyy-MM-dd');
        const toDateString = format(toDate, 'yyyy-MM-dd');

        const response = await fetch(`${API_URL}/api/timeSlots/interval?from=${fromDateString}&to=${toDateString}`, {
            method: "GET",
            headers: {
                "Authorization": `${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching time slots: ${response.statusText}`);
        }

        return this.mapTimeSlots(await response.json());
    }

    public async getTimeSlotsByDay(userId: number | null, date: Date): Promise<TTimeSlot[]> {
        if (userId === null) {
            throw new Error("User ID is null");
        }

        const dateString = format(date, 'yyyy-MM-dd');

        const response = await fetch(`${API_URL}/api/timeSlots/day/${userId}?date=${dateString}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Error fetching time slots: ${response.statusText}`);
        }

        return this.mapTimeSlots(await response.json());
    }

    public async createTimeSlot(timeSlot: TTimeSlot): Promise<TTimeSlot> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        const response = await fetch(`${API_URL}/api/timeSlot`, {
            method: "POST",
            body: JSON.stringify({timeSlot}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Error creating time slot: ${response.statusText}`);
        }

        return this.mapTimeSlot(await response.json());
    }

    public deleteTimeSlot(timeSlot: TTimeSlot): void {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        fetch(`${API_URL}/api/timeSlot/${timeSlot.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `${token}`,
            }
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`Error deleting time slot: ${response.statusText}`);
            } else {
                return response.json();
            }
        }).then((data) => {
            if (data[0] === 0) {
                throw new Error(`No time slot with ID ${timeSlot.id} found`);
            }
        }).catch((error) => {
            LogApi.logError(error, timeSlot);
        });
    }

    private mapTimeSlots(data: any[]): TTimeSlot[] {
        const timeSlots: TTimeSlot[] = [];

        data.forEach((timeSlot) => {
            timeSlots.push(this.mapTimeSlot(timeSlot));
        });

        return timeSlots;
    }

    private mapTimeSlot(object: any): TTimeSlot {
        return ({
            id: object.id,
            date: object.date,
            startTime: object.startTime,
            endTime: object.endTime,
        });
    }

}

export default new TimeSlotApi();