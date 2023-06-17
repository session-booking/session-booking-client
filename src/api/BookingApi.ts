import {TBooking} from "../types/TBooking";
import {format} from "date-fns";
import {API_URL} from "./config/config";
import LogApi from "./LogApi";

class BookingApi {

    public async getAllBookings(): Promise<TBooking[]> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        const response = await fetch(`${API_URL}/api/bookings`, {
            method: "GET",
            headers: {
                "Authorization": `${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching bookings: ${response.statusText}`);
        }

        return this.mapBookings(await response.json());
    }

    public async getBookingsByDay(userId: number | null, date: Date): Promise<TBooking[]> {
        if (userId === null) {
            throw new Error("User ID is null");
        }

        const dateString = format(date, 'yyyy-MM-dd');

        const response = await fetch(`${API_URL}/api/bookings/day/${userId}?date=${dateString}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Error fetching bookings: ${response.statusText}`);
        }

        return this.mapBookings(await response.json());
    }

    public async createBooking(booking: TBooking): Promise<TBooking> {
        const response = await fetch(`${API_URL}/api/booking`, {
            method: "POST",
            body: JSON.stringify({booking}),
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`Error creating booking: ${response.statusText}`);
        }

        return this.mapBooking(await response.json());
    }

    public deleteBooking(booking: TBooking): Promise<void> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        return fetch(`${API_URL}/api/booking/${booking.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `${token}`,
            }
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`Error deleting booking: ${response.statusText}`);
            } else {
                return response.json();
            }
        }).then((data) => {
            if (data[0] === 0) {
                throw new Error(`No booking with ID ${booking.id} found`);
            }
        }).catch((error) => {
            LogApi.logError(error, booking);
        });
    }

    private mapBookings(data: any[]): TBooking[] {
        const bookings: TBooking[] = [];

        data.forEach((booking) => {
            bookings.push(this.mapBooking(booking));
        });

        return bookings;
    }

    private mapBooking(data: any): TBooking {
        return ({
            id: data.id,
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            clientPhone: data.clientPhone,
            date: data.date,
            startTime: data.startTime,
            endTime: data.endTime,
            userId: data.userId,
            serviceId: data.serviceId,
            timeSlotId: data.timeSlotId,
        })
    }

}

export default new BookingApi();