import {TClientDetailsProps} from "../../types/props/TClientDetailsProps";

function ClientDetails({clientDetails, handleClientNameChange, handleClientSurnameChange, handleClientEmailChange, handleClientPhoneChange}: TClientDetailsProps) {
    return (
        <div className="client-details">
            <div className="w-full mr-5">
                <label className="text-black text-base font-light">
                    Name
                    <input
                        value={clientDetails.clientName}
                        onChange={handleClientNameChange}
                        type="text"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                            font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md mb-5"
                        placeholder="Enter your name..."
                    />
                </label>
                <label className="text-black text-base font-light">
                    Surname
                    <input
                        value={clientDetails.clientSurname}
                        onChange={handleClientSurnameChange}
                        type="text"
                        className="details-surname w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                            font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        placeholder="Enter your surname..."
                    />
                </label>
            </div>
            <div className="w-full">
                <label className="text-black text-base font-light">
                    Email
                    <input
                        value={clientDetails.clientEmail}
                        onChange={handleClientEmailChange}
                        type="email"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                            font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md mb-5"
                        placeholder="example@address.com"
                    />
                </label>
                <label className="text-black text-base font-light">
                    Phone number
                    <input
                        value={clientDetails.clientPhone}
                        onChange={handleClientPhoneChange}
                        type="tel"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                            font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        pattern="[0-9]{9}"
                        placeholder="Optional (9 digits)"
                    />
                </label>
            </div>
        </div>
    );
}

export default ClientDetails;