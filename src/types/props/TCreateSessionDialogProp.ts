import {TSession} from "../TSession";

export type TCreateSessionDialogProp = {
    isDialogOpen: boolean;
    handleChange: (newSession: TSession) => void;
    toggleDialog: () => void;
}