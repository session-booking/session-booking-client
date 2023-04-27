import { TSession } from "../TSession"

export type TCreateSessionProp = {
    hideSidebar: () => void;
    handleChange: (newSession: TSession) => void;
    handleToggleDialog: () => void;
}