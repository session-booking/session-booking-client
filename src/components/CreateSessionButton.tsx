import {IoAddSharp} from "react-icons/io5";

function CreateSessionButton({handleToggleDialog}: { handleToggleDialog: () => void }) {

    return (
        <button
            onClick={handleToggleDialog}
            className="flex h-fit px-4 py-2 bg-blue-500 rounded-md shadow-sm
            hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 hover:shadow-lg ease-in-out duration-200">
            <IoAddSharp className="text-[22px] text-white mt-[1px]"/><p
            className="text-md font-normal text-white">&nbsp;&nbsp;Create</p>
        </button>
    );
}

export default CreateSessionButton;