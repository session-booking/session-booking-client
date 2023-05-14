import { TSession } from "../TSession"

export type TCreateSessionProps = {
    hideSidebar: () => void;
    handleCreate: (newSession: TSession) => void;
    handleToggleDialog: () => void;
}