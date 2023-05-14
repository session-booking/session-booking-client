import {CSSTransition, SwitchTransition} from 'react-transition-group';
import {ContentType} from "../enums/ContentType";
import {TRightSidebarProps} from "../types/props/TRightSidebarProps";
import QRContent from "./QRContent";
import NotificationContent from "./NotificationContent";
import SettingsContent from "./SettingsContent";

function RightSidebar({content}: TRightSidebarProps) {
    return (
        <SwitchTransition mode="out-in">
            <CSSTransition
                key={content}
                timeout={200}
                classNames="fade"
                unmountOnExit
            >
                <div>
                    {content === ContentType.QR_CONTENT && <QRContent/>}
                    {content === ContentType.NOTIFICATION_CONTENT && <NotificationContent/>}
                    {content === ContentType.SETTINGS_CONTENT && <SettingsContent/>}
                </div>
            </CSSTransition>
        </SwitchTransition>
    )
}

export default RightSidebar;