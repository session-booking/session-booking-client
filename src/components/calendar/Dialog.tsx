import {TDialogProps} from "../../types/props/TDialogProps";
import {IoClose} from "react-icons/io5";

function Dialog({isDialogOpen, toggleDialog, children}: TDialogProps) {
    return (
        <div>
            {isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="fixed inset-0 bg-black opacity-50"
                        onClick={toggleDialog}
                    ></div>
                    <div className="relative bg-white p-3 max-w-md mx-auto rounded-xl shadow-md items-center">
                        <IoClose
                            size={30}
                            className="absolute top-2 right-2 cursor-pointer"
                            onClick={toggleDialog}
                        />
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dialog;