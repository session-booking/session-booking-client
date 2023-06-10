import {IoAddSharp} from "react-icons/io5";
import {TButtonProps} from "../../types/props/TButtonProps";

function CreateSessionButton({handleToggleDialog}: TButtonProps) {
    return (
        <button
            onClick={handleToggleDialog}
            className="px-4 py-2 bg-blue-500 rounded-md shadow-sm hover:bg-indigo-500 hover:shadow-lg
            ease-in-out duration-200 w-full">
            <div className="flex justify-center">
                <IoAddSharp className="text-[22px] text-white mt-[1px]"/>
                <p className="text-md font-normal text-white">&nbsp;&nbsp;Create a new session</p>
            </div>
        </button>
    );
}

export default CreateSessionButton;