import {TConfirmProfileDeletionProps} from "../../types/props/TConfirmProfileDeletionProps";
import React, {useState} from "react";
import {ClipLoader} from "react-spinners";

function ConfirmProfileDeletion({handleDeleteProfile, handleToggleDialog}: TConfirmProfileDeletionProps) {
    const [isLoading, setIsLoading] = useState(false);

    function deleteProfile() {
        setIsLoading(true);
        handleDeleteProfile();
        setIsLoading(false);
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="p-5">
                <h1 className="block text-gray-700 text-xl font-bold mb-4">Confirm Profile Deletion</h1>
                <p className="mb-6 text-gray-700 text-lg">Are you sure you want to delete your profile? This action cannot be undone.</p>
                <div className="flex gap-4">
                    <button
                        onClick={deleteProfile}
                        className="text-lg bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                            transition duration-300"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ClipLoader color="#ffffff" size={20} className="mt-1"/>
                        ) : (
                            "Yes"
                        )}
                    </button>
                    <button
                        onClick={handleToggleDialog}
                        className="text-lg bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
                            transition duration-300"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmProfileDeletion;
