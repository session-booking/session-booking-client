import {TService} from "../types/TService";
import {API_URL} from "./config/config";
import LogApi from "./LogApi";

class ServiceApi {

    public async getServices(userId: number | null): Promise<TService[]> {
        if (userId === null) {
            throw new Error("User ID is null");
        }

        const response = await fetch(`${API_URL}/api/services/${userId}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Error fetching services: ${response.statusText}`);
        }

        return this.mapServices(await response.json());
    }

    public async createService(service: TService): Promise<TService> {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("JWT token not found in local storage");
        }

        const response = await fetch(`${API_URL}/api/service`, {
            method: "POST",
            body: JSON.stringify({service}),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Error creating service: ${response.statusText}`);
        }

        return this.mapService(await response.json());
    }

    public deleteService(service: TService): void {
        const token = localStorage.getItem("token");

        if (!token) {
            LogApi.logError("JWT token not found in local storage", null);
        }

        fetch(`${API_URL}/api/service/${service.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `${token}`,
            }
        }).then((response) => {
            if (!response.ok) {
                LogApi.logError(`Error updating session: ${response.statusText}`, {data: service});
            }
        }).catch((error) => {
            LogApi.logError(error, {data: service});
        });
    }

    private mapServices(data: []): TService[] {
        const services: TService[] = [];

        data.forEach((object: any) => {
            services.push(this.mapService(object));
        });

        return services;
    }

    private mapService(object: any): TService {
        return ({
            id: object.id,
            name: object.name,
            length: object.length,
        });
    }

}

export default new ServiceApi();