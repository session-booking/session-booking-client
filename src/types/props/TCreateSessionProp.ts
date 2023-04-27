import { TSession } from "../TSession"

export type TCreateSessionProp = {
    handleChange: (newSession: TSession) => void;
    handleToggleDialog: () => void;
}