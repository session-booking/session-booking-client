import {API_URL} from "./config/config";
import {TSession} from "../types/TSession";
import LogApi from "./LogApi";
import {format} from "date-fns";

class SessionApi {

    public async getSessionsByDateInterval(fromDate: Date, toDate: Date): Promise<TSession[]> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        const fromDateString = format(fromDate, 'yyyy-MM-dd');
        const toDateString = format(toDate, 'yyyy-MM-dd');

        const response = await fetch(`${API_URL}/api/sessions/interval?from=${fromDateString}&to=${toDateString}`, {
            method: "GET",
            headers: {
                "Authorization": `${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching sessions: ${response.statusText}`);
        }

        return this.mapSessions(await response.json());
    }

    public async getSessionsByDay(userId: number | null, date: Date): Promise<TSession[]> {
        if (userId === null) {
            throw new Error("User ID is null");
        }

        const dateString = format(date, 'yyyy-MM-dd');

        const response = await fetch(`${API_URL}/api/sessions/day/${userId}?date=${dateString}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Error fetching sessions: ${response.statusText}`);
        }

        return this.mapSessions(await response.json());
    }

    public async createSession(session: TSession): Promise<TSession> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        const response = await fetch(`${API_URL}/api/session`, {
            method: "POST",
            body: JSON.stringify({session}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Error creating session: ${response.statusText}`);
        }

        return this.mapSession(await response.json());
    }

    public deleteSession(session: TSession): void {
        const token = localStorage.getItem("token");

        if (!token) {
            LogApi.logError("JWT token not found in local storage", null);
        }

        fetch(`${API_URL}/api/session/${session.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `${token}`,
            }
        }).then((response) => {
            if (!response.ok) {
                LogApi.logError(`Error updating session: ${response.statusText}`, session);
            } else {
                return response.json();
            }
        }).then((data) => {
            if (data[0] === 0) {
                throw new Error(`No session with ID ${session.id} found`);
            }
        }).catch((error) => {
            LogApi.logError(error, session);
        });
    }

    private mapSessions(data: []): TSession[] {
        const sessions: TSession[] = [];

        data.forEach((object: any) => {
            sessions.push(this.mapSession(object));
        });

        return sessions;
    }

    private mapSession(object: any): TSession {
        return ({
            id: object.id,
            date: object.date,
            startTime: object.startTime,
            endTime: object.endTime,
            clientEmail: object.clientEmail,
            clientPhone: object.clientPhone,
            clientName: object.clientName,
            color: object.color
        });
    }

}

export default new SessionApi();