import {TTimeSlot} from "../types/TTimeSlot";
import {API_URL} from "./config";
import LogApi from "./LogApi";

class TimeSlotApi {

    public async getTimeSlots(fromDate: Date, toDate: Date): Promise<TTimeSlot[]> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        const fromDateString = fromDate.toISOString().substring(0, 10);
        const toDateString = toDate.toISOString().substring(0, 10);

        const response = await fetch(`${API_URL}/api/timeSlots?from=${fromDateString}&to=${toDateString}`, {
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