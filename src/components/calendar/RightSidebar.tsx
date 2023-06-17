import {CSSTransition, SwitchTransition} from 'react-transition-group';
import {ContentType} from "../../enums/ContentType";
import {TRightSidebarProps} from "../../types/props/TRightSidebarProps";
import QRContent from "./QRContent";
import NotificationContent from "./NotificationContent";
import UserSettingsContent from "./UserSettingsContent";

function RightSidebar({
                          content,
                          bookings,
                          services,
                          handleAcceptedNotification,
                          handleDeclinedNotification,
                          userEdit,
                          handleUserEditUsernameChange,
                          handleUserEditPasswordChange,
                          handleUserEditPhoneNumberChange,
                          handleUpdateUser,
                          logout,
                          toggleConfirmProfileDeletionDialog
                      }: TRightSidebarProps) {
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
                    {content === ContentType.NOTIFICATION_CONTENT &&
                        <NotificationContent
                            bookings={bookings}
                            services={services}
                            handleAcceptedNotification={handleAcceptedNotification}
                            handleDeclinedNotification={handleDeclinedNotification}
                        />}
                    {content === ContentType.SETTINGS_CONTENT &&
                        <UserSettingsContent
                            userEdit={userEdit}
                            handleUserEditUsernameChange={handleUserEditUsernameChange}
                            handleUserEditPasswordChange={handleUserEditPasswordChange}
                            handleUserEditPhoneNumberChange={handleUserEditPhoneNumberChange}
                            handleUpdateUser={handleUpdateUser}
                            logout={logout}
                            toggleConfirmProfileDeletionDialog={toggleConfirmProfileDeletionDialog}
                        />}
                </div>
            </CSSTransition>
        </SwitchTransition>
    )
}

export default RightSidebar;