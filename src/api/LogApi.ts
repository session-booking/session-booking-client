import {API_URL} from "./config/config";

class LogApi {

    public logInfo(message: string, data: any): void {
        fetch(`${API_URL}/api/logger/info`, {
            method: "POST",
            body: JSON.stringify({
                message,
                data
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            if (!response.ok) {
                console.error("Failed to log info");
            }
        });
    }

    public logWarn(message: string, data: any): void {
        fetch(`${API_URL}/api/logger/warn`, {
            method: "POST",
            body: JSON.stringify({
                message,
                data
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            if (!response.ok) {
                console.error("Failed to log warn");
            }
        });
    }

    public logError(message: string, data: any): void {
        fetch(`${API_URL}/api/logger/error`, {
            method: "POST",
            body: JSON.stringify({
                message,
                data
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            if (!response.ok) {
                console.error("Failed to log error");
            }
        });
    }

}

export default new LogApi();