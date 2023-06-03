import {TService} from "../TService";

export type TAddServiceProps = {
    services: TService[];
    handleAddService: (newService: TService) => void;
    handleDeleteService: (service: TService | null) => void;
}