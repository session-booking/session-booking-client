import React from "react";
import {TButtonProps} from "../../types/props/TButtonProps";

function AddServiceButton({handleToggleDialog}: TButtonProps) {
    return (
        <button
            onClick={handleToggleDialog}
            className="rounded-md w-full text-blue-500 border border-blue-500 hover:bg-blue-200 py-2 px-4 transition
            duration-300 mt-5"
        >
            <p className="font-light ml-2">Add services for clients</p>
        </button>
    );
}

export default AddServiceButton;