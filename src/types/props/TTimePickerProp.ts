import React from "react";

export type TTimePickerProp = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}