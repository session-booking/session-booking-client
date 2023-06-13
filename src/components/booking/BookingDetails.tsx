import {TBookingDetailsProps} from "../../types/props/TBookingDetailsProps";
import {IoMdTime, IoIosCalendar, IoMdPerson, IoMdMail, IoMdCall, IoMdHelpBuoy} from 'react-icons/io';
import {CommonsHelper} from "../../helpers/CommonsHelper";

function BookingDetails({clientDetails, selectedService, selectedAvailableSession}: TBookingDetailsProps) {

    function formatTime(startTime: string, endTime: string) {
        return `${startTime} - ${endTime}`;
    }

    function formatName(name: string, surname: string) {
        return `${name} ${surname}`;
    }

    return (
        <div className="flex justify-center p-5">
            <div className="w-full max-w-full flex flex-col justify-center items-center">
                <div className="sm:ml-0 md:ml-16">
                    <p className="text-2xl font-normal mb-5">Is the booking information correct?</p>
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16">
                        <div className="flex items-center space-x-2">
                            <IoMdHelpBuoy className="text-xl mt-0.5"/>
                            <p className="text-xl font-normal">Service:</p>
                            <p className="text-xl font-thin flex-grow">{selectedService?.name ?? '-'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <IoMdPerson className="text-xl mt-0.5"/>
                            <p className="text-xl font-normal">Name:</p>
                            <p className="text-xl font-thin flex-grow">{formatName(clientDetails.clientName, clientDetails.clientSurname)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <IoIosCalendar className="text-xl mt-0.5"/>
                            <p className="text-xl font-normal">Date:</p>
                            <p className="text-xl font-thin flex-grow">{selectedAvailableSession ? CommonsHelper.formatDate(selectedAvailableSession.date) : '-'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <IoMdTime className="text-xl mt-0.5"/>
                            <p className="text-xl font-normal">Time:</p>
                            <p className="text-xl font-thin flex-grow">{selectedAvailableSession ? formatTime(selectedAvailableSession.startTime, selectedAvailableSession.endTime) : '-'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <IoMdMail className="text-xl mt-0.5"/>
                            <p className="text-xl font-normal">Email:</p>
                            <p className="text-xl font-thin flex-grow">{clientDetails.clientEmail}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <IoMdCall className="text-xl mt-0.5"/>
                            <p className="text-xl font-normal">Phone:</p>
                            <p className="text-xl font-thin flex-grow">{clientDetails.clientPhone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingDetails;
