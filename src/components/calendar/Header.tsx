import "../../Header.css";
import {IoNotificationsOutline, IoSettingsOutline} from "react-icons/io5";
import {AiOutlineQrcode} from "react-icons/ai";
import {THeaderProps} from "../../types/props/THeaderProps";
import {ContentType} from "../../enums/ContentType";

function Header({qrButtonRef, notificationButtonRef, settingsButtonRef, rightSidebarContent, onHeaderButtonClick}: THeaderProps) {
    return (
        <header className="px-4 py-1 flex items-center justify-between border-b border-gray-300">
            <div className="flex items-center">
                <div className="app-name m-0 font-light">Session Booking</div>
                <button className="today-button font-light text-blue-500 border border-blue-500 px-2 ml-4 rounded-md
                        hover:bg-blue-200 transition duration-300">
                    Today
                </button>
            </div>
            <div className="flex items-center">
                <button
                    ref={qrButtonRef}
                    onClick={() => onHeaderButtonClick(ContentType.QR_CONTENT)}
                    className={`${(rightSidebarContent === ContentType.QR_CONTENT) ? "bg-blue-600" : "bg-blue-500"} 
                    border-none cursor-pointer p-2 ml-2 hover:bg-blue-600 rounded-full transition duration-300`}>
                    <AiOutlineQrcode size={24} className="text-white"/>
                </button>
                <button
                    ref={notificationButtonRef}
                    onClick={() => onHeaderButtonClick(ContentType.NOTIFICATION_CONTENT)}
                    className={`${(rightSidebarContent === ContentType.NOTIFICATION_CONTENT) ? "bg-gray-300" : "bg-transparent"} 
                    border-none cursor-pointer p-2 ml-2 hover:bg-gray-300 rounded-full transition duration-300`}>
                    <IoNotificationsOutline size={24}/>
                </button>
                <button
                    ref={settingsButtonRef}
                    onClick={() => onHeaderButtonClick(ContentType.SETTINGS_CONTENT)}
                    className={`${(rightSidebarContent === ContentType.SETTINGS_CONTENT) ? "bg-gray-300" : "bg-transparent"} 
                    border-none cursor-pointer p-2 ml-2 hover:bg-gray-300 rounded-full transition duration-300`}>
                    <IoSettingsOutline size={24}/>
                </button>
            </div>
        </header>
    );
}

export default Header;