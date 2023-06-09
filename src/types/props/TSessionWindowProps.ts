import {TSession} from "../TSession";
import React from "react";

export type TSessionWindowProps = {
    session: TSession | null;
    visible: boolean;
    onClose: () => void;
    clickEvent: React.MouseEvent<HTMLDivElement> | null;
    handleDeleteSession: (session: TSession | null) => void;
}