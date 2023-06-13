import "../../Header.css";
import {IoNotificationsOutline, IoSettingsOutline} from "react-icons/io5";
import {AiOutlineQrcode} from "react-icons/ai";
import {THeaderProps} from "../../types/props/THeaderProps";
import {ContentType} from "../../enums/ContentType";

function Header({notificationCount, qrButtonRef, notificationButtonRef, settingsButtonRef, rightSidebarContent, onHeaderButtonClick}: THeaderProps) {
    return (
        <header className="px-4 py-1 flex items-center justify-between border-b border-gray-300">
            <div className="flex items-center">
                <div className="app-name m-0 font-light">Session Booking</div>
                <button className="today-button font-light text-blue-500 border border-blue-500 px-2 ml-4 rounded-md
                        hover:bg-blue-100 transition duration-300 text-[18px]">
                    Today
                </button>
            </div>
            <div className="flex items-center">
                <button
                    ref={qrButtonRef}
                    onClick={() => onHeaderButtonClick(ContentType.QR_CONTENT)}
                    className={`${(rightSidebarContent === ContentType.QR_CONTENT) ? "bg-blue-600" : "bg-blue-500"} 
                    border-none cursor-pointer p-2 ml-2 hover:bg-blue-600 rounded-full transition duration-300`}>
                    <AiOutlineQrcode size={30} className="text-white"/>
                </button>
                <button
                    ref={notificationButtonRef}
                    onClick={() => onHeaderButtonClick(ContentType.NOTIFICATION_CONTENT)}
                    className={`relative ${(rightSidebarContent === ContentType.NOTIFICATION_CONTENT) ? "bg-gray-300" : "bg-transparent"} 
                    border-none cursor-pointer p-2 ml-2 hover:bg-gray-300 rounded-full transition duration-300`}>
                    <IoNotificationsOutline size={30}/>
                    {notificationCount > 0 &&
                        <div className="absolute top-0 right-0 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                            {notificationCount}
                        </div>
                    }
                </button>
                <button
                    ref={settingsButtonRef}
                    onClick={() => onHeaderButtonClick(ContentType.SETTINGS_CONTENT)}
                    className={`${(rightSidebarContent === ContentType.SETTINGS_CONTENT) ? "bg-gray-300" : "bg-transparent"} 
                    border-none cursor-pointer p-2 ml-2 hover:bg-gray-300 rounded-full transition duration-300`}>
                    <IoSettingsOutline size={30}/>
                </button>
            </div>
        </header>
    );
}

export default Header;