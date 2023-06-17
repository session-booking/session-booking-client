import {ContentType} from "../../enums/ContentType";
import React from "react";

export type THeaderProps = {
    notificationCount: number;
    qrButtonRef: React.RefObject<HTMLButtonElement>;
    notificationButtonRef: React.RefObject<HTMLButtonElement>;
    settingsButtonRef: React.RefObject<HTMLButtonElement>;
    rightSidebarContent: ContentType;
    onHeaderButtonClick: (content: ContentType) => void;
    setCurrentWeek: () => void;
}