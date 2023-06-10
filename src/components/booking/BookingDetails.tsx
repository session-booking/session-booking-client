import {TBookingDetailsProps} from "../../types/props/TBookingDetailsProps";
import {IoMdTime, IoIosCalendar, IoMdPerson, IoMdMail, IoMdCall, IoMdHelpBuoy} from 'react-icons/io';

function BookingDetails({clientDetails, selectedService, selectedAvailableSession}: TBookingDetailsProps) {
    function formatDate(date: Date | null) {
        if (date != null) {
            const definedDate = new Date(date);

            const day = definedDate.getDate().toString().padStart(2, '0');
            const month = (definedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = definedDate.getFullYear();
            return `${day}.${month}.${year}`;
        } else {
            return null;
        }
    }

    function formatTime(startTime: string, endTime: string) {
        return `${startTime} - ${endTime}`;
    }

    function formatName(name: string, surname: string) {
        return `${name} ${surname}`;
    }

    return (
        <div className="flex justify-center p-5">
            <div className="w-full max-w-md">
                <p className="text-2xl font-semibold mb-5">Is the booking information correct?</p>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2">
                        <IoMdHelpBuoy className="text-xl mt-0.5"/>
                        <p className="text-xl font-semibold">Service:</p>
                        <p className="text-xl font-light flex-grow">{selectedService?.name ?? '-'}</p>
                    </div>
                    <hr/>
                    <div className="flex items-center space-x-2">
                        <IoIosCalendar className="text-xl mt-0.5"/>
                        <p className="text-xl font-semibold">Date:</p>
                        <p className="text-xl font-light flex-grow">{selectedAvailableSession ? formatDate(selectedAvailableSession.date) : '-'}</p>
                    </div>
                    <hr/>
                    <div className="flex items-center space-x-2">
                        <IoMdTime className="text-xl mt-0.5"/>
                        <p className="text-xl font-semibold">Time:</p>
                        <p className="text-xl font-light flex-grow">{selectedAvailableSession ? formatTime(selectedAvailableSession.startTime, selectedAvailableSession.endTime) : '-'}</p>
                    </div>
                    <hr/>
                    <div className="flex items-center space-x-2">
                        <IoMdPerson className="text-xl mt-0.5"/>
                        <p className="text-xl font-semibold">Client name:</p>
                        <p className="text-xl font-light flex-grow">{formatName(clientDetails.clientName, clientDetails.clientSurname)}</p>
                    </div>
                    <hr/>
                    <div className="flex items-center space-x-2">
                        <IoMdMail className="text-xl mt-0.5"/>
                        <p className="text-xl font-semibold">Client email:</p>
                        <p className="text-xl font-light flex-grow">{clientDetails.clientEmail}</p>
                    </div>
                    <hr/>
                    <div className="flex items-center space-x-2">
                        <IoMdCall className="text-xl mt-0.5"/>
                        <p className="text-xl font-semibold">Client phone:</p>
                        <p className="text-xl font-light flex-grow">{clientDetails.clientPhone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingDetails;
