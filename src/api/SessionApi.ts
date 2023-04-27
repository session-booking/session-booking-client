import { API_URL } from "./config";
import { TSession } from "../types/TSession";
import LogApi from "./LogApi";

class SessionApi {

    public async getSessions(): Promise<TSession[]> {
        const response = await fetch(`${API_URL}/api/sessions`);
        return this.mapSessions(await response.json());
    }

    public async createSession(session: TSession): Promise<TSession> {
        const response = await fetch(`${API_URL}/api/session`, {
            method: "POST",
            body: JSON.stringify({
                session
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        return this.mapSession(await response.json());
    }

    public async updateSession(session: TSession): Promise<TSession> {
        const response = await fetch(`${API_URL}/api/session`, {
            method: "PUT",
            body: JSON.stringify({
                session
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        return this.mapSession(await response.json());
    }

    public deleteSession(session: TSession): void {
        fetch(`${API_URL}/api/session/${session.id}`, {
            method: "DELETE",
        }).then((response) => {
            if (!response.ok) {
                LogApi.logError("Failed to delete session", session);
            }
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
            open: object.open,
            start_time: object.start_time,
            end_time: object.end_time,
            client_email: object.client_email,
            client_name: object.client_name,
            color: object.color
        });
    }

}

export default new SessionApi();