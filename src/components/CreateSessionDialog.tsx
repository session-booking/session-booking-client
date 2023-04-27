import CreateSession from "./CreateSession";
import {TCreateSessionDialogProp} from "../types/props/TCreateSessionDialogProp";

function CreateSessionDialog({isDialogOpen, handleChange, toggleDialog}: TCreateSessionDialogProp) {
    return (
        <div>
            {isDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="fixed inset-0 bg-black opacity-50"
                        onClick={toggleDialog}
                    ></div>
                    <div className="relative bg-white p-6 max-w-md mx-auto rounded-xl shadow-md items-center space-x-4">
                        <CreateSession
                            handleChange={handleChange}
                            handleToggleDialog={toggleDialog}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateSessionDialog;