import "../Header.css";
import {IoNotificationsOutline, IoSettingsOutline} from "react-icons/io5";
import { AiOutlineQrcode } from "react-icons/ai";

function Header() {
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
                <button className="bg-blue-500 border-none cursor-pointer p-2 ml-2 hover:bg-blue-600 rounded-full
                transition duration-300">
                    <AiOutlineQrcode size={24} className="text-white" />
                </button>
                <button className="bg-transparent border-none cursor-pointer p-2 ml-2 hover:bg-gray-300 rounded-full
                transition duration-300">
                    <IoNotificationsOutline size={24} />
                </button>
                <button className="bg-transparent border-none cursor-pointer p-2 ml-2 hover:bg-gray-300 rounded-full
                transition duration-300">
                    <IoSettingsOutline size={24} />
                </button>
            </div>
        </header>
    );
}

export default Header;