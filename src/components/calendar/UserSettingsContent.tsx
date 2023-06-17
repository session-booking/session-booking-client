import React, {useState} from "react";
import {FiEye, FiEyeOff, FiLogOut, FiUserX} from "react-icons/fi";
import {TUserSettingsContentProps} from "../../types/props/TUserSettingsContentProps";
import {CommonsHelper} from "../../helpers/CommonsHelper";
import {ClipLoader} from "react-spinners";

function UserSettingsContent({
                                 userEdit,
                                 handleUserEditUsernameChange,
                                 handleUserEditPasswordChange,
                                 handleUserEditPhoneNumberChange,
                                 handleUpdateUser,
                                 logout,
                                 toggleConfirmProfileDeletionDialog
                             }: TUserSettingsContentProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [updateStatus, setUpdateStatus] = useState<boolean | undefined>(undefined);
    const [updateMessage, setUpdateMessage] = useState<string | undefined>(undefined);

    const [validationMessages, setValidationMessages] = useState({
        username: "",
        phoneNumber: "",
        password: "",
    });

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        let formValid = CommonsHelper.validateUsername(userEdit.username);

        if (userEdit.password && userEdit.password !== "") {
            formValid = formValid && CommonsHelper.validatePassword(userEdit.password);
        }

        if (userEdit.phoneNumber && userEdit.phoneNumber !== "") {
            formValid = formValid && CommonsHelper.validatePhoneNumber(userEdit.phoneNumber);
        }

        if (formValid) {
            const isSuccess = await handleUpdateUser();
            if (isSuccess) {
                setUpdateStatus(true);
                setUpdateMessage("User successfully updated.");
            } else {
                setUpdateStatus(false);
                setUpdateMessage("User update failed. Try again later.");
            }
        }

        setIsLoading(false);
    }

    function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        handleUserEditUsernameChange(value);
        setValidationMessages({
            ...validationMessages,
            username: CommonsHelper.validateUsername(value) ? '' : 'Username must be at least 5 characters long.',
        });
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        handleUserEditPasswordChange(value);
        setValidationMessages({
            ...validationMessages,
            password: CommonsHelper.validatePassword(value)
                ? ''
                : 'Password must contain at least 8 characters, one number, and one symbol.',
        });
    }

    function handlePhoneNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        handleUserEditPhoneNumberChange(value);
        setValidationMessages({
            ...validationMessages,
            phoneNumber: CommonsHelper.validatePhoneNumber(value) ? '' : 'Phone number must have exactly 9 digits.',
        });
    }

    return (
        <div className="m-4">
            {updateMessage && (
                <div
                    className={`mb-4 flex flex-col justify-center items-center ${updateStatus ? "text-green-600" : "text-red-600"}`}>
                    <p className="text-md font-normal">{updateMessage}</p>
                </div>
            )}
            <h2 className="text-gray-700 font-normal text-[20px] mb-4 border-b border-gray-400">Edit your profile</h2>
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="w-full mb-4">
                    <label className="text-black text-base font-light">
                        Username
                        <input
                            value={userEdit.username}
                            onChange={handleUsernameChange}
                            type="text"
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-normal
                            text-black outline-none focus:border-[#6A64F1] focus:shadow-md"
                            required
                        />
                    </label>
                    <p className="text-xs text-red-500 mt-2">{validationMessages.username}</p>
                </div>
                <div className="w-full mb-4">
                    <div className="relative">
                        <label className="text-black text-base font-light">
                            Password
                            <input
                                value={userEdit.password}
                                onChange={handlePasswordChange}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-normal
                                    text-black outline-none focus:border-[#6A64F1] focus:shadow-md"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Change password"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 focus:outline-none mr-1 mt-3"
                        >
                            {showPassword ? <FiEyeOff size={20}/> : <FiEye size={20}/>}
                        </button>
                    </div>
                    <p className="text-xs text-red-500 mt-2">{validationMessages.password}</p>
                </div>
                <div className="w-full mb-4">
                    <label className="text-black text-base font-light">
                        Phone number
                        <input
                            value={userEdit.phoneNumber}
                            onChange={handlePhoneNumberChange}
                            type="tel"
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                                font-normal text-black outline-none focus:border-[#6A64F1] focus:shadow-md"
                            placeholder="Optional (9 digits)"
                            pattern="[0-9]{9}"
                        />
                    </label>
                    <p className="text-xs text-red-500 mt-2">{validationMessages.phoneNumber}</p>
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded
                               transition duration-300 focus:outline-none focus:shadow-outline text-[18px] w-full mb-4"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ClipLoader color="#ffffff" size={20} className="mt-1"/>
                    ) : (
                        "Save"
                    )}
                </button>
            </form>
            <h2 className="text-gray-700 font-normal text-[20px] mb-4 border-b border-gray-400">Other</h2>
            <button
                onClick={logout}
                className="flex justify-center bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded
                        transition duration-300 focus:outline-none focus:shadow-outline text-[18px] w-full mb-4"
            >
                <FiLogOut size={20} className="mr-4 mt-1"/>
                <p>Logout</p>
            </button>
            <button
                onClick={toggleConfirmProfileDeletionDialog}
                className="flex justify-center bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded
                        transition duration-300 focus:outline-none focus:shadow-outline text-[18px] w-full mb-12"
            >
                <FiUserX size={20} className="mr-4 mt-1"/>
                <p>Delete Profile</p>
            </button>
        </div>
    );
}

export default UserSettingsContent;