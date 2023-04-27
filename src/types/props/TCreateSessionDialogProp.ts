import {TSession} from "../TSession";

export type TCreateSessionDialogProp = {
    hideSidebar: () => void;
    isDialogOpen: boolean;
    handleChange: (newSession: TSession) => void;
    toggleDialog: () => void;
}