import React from "react";

export type TDialogProps = {
    isDialogOpen: boolean;
    toggleDialog: () => void;
    children: React.ReactNode;
}