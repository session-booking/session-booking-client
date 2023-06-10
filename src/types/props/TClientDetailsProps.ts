import {TClientDetails} from "../TClientDetails";
import React from "react";

export type TClientDetailsProps = {
    clientDetails: TClientDetails;
    handleClientNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClientSurnameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClientEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClientPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}