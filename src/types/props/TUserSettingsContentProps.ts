import {TUserEdit} from "../TUserEdit";

export type TUserSettingsContentProps = {
    userEdit: TUserEdit;
    handleUserEditUsernameChange: (value: string) => void;
    handleUserEditPasswordChange: (value: string) => void;
    handleUserEditPhoneNumberChange: (value: string) => void;
    handleUpdateUser: () => Promise<boolean>;
    logout: () => void;
    toggleConfirmProfileDeletionDialog: () => void;
}