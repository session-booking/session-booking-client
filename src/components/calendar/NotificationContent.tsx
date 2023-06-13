 import React from 'react';
import {TNotificationContentProps} from "../../types/props/TNotificationContentProps";
import {TBooking} from "../../types/TBooking";
import {CommonsHelper} from "../../helpers/CommonsHelper";
import {FaEnvelope, FaPhone} from 'react-icons/fa';
import {useTransition, animated} from 'react-spring';

function NotificationContent({bookings, services, handleAcceptedNotification, handleDeclinedNotification}: TNotificationContentProps) {
    const validBookings = bookings.filter(booking => booking.id !== undefined);

    const transitions = useTransition(validBookings, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        keys: validBookings.map((booking: TBooking) => booking.id!),
    });

    function getServiceName(serviceId: number | undefined) {
        const service = services.find(service => service.id === serviceId);
        return service?.name;
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-full overflow-y-auto mb-[80px]">
            {(bookings.length === 0)
                ? (<div className="text-gray-500 text-xl mt-5">No notifications</div>)
                : (transitions((styles, booking) => (
                    <animated.div style={styles} key={booking.id}
                                  className="flex flex-col border border-gray-300 p-5 rounded-xl bg-gray-50 text-black w-[280px] mt-5">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-thin mr-[30px]">{CommonsHelper.formatDate(booking.date)}</p>
                            <div className="flex justify-between items-center">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-full mr-3 transition duration-300"
                                    onClick={() => window.location.href = `mailto:${booking.clientEmail}`}>
                                    <FaEnvelope/>
                                </button>
                                <button
                                    className="border border-blue-500 hover:bg-blue-100 text-blue-500 font-bold p-2 rounded-full transition duration-300"
                                    onClick={() => window.location.href = `tel:${booking.clientPhone}`}>
                                    <FaPhone/>
                                </button>
                            </div>
                        </div>
                        <p className="text-xl font-bold mt-2">{getServiceName(booking.serviceId)}</p>
                        <p className="text-xl font-light mt-3">From <span
                            className="font-thin">{booking.startTime}</span> to <span
                            className="font-thin">{booking.endTime}</span></p>
                        <p className="text-xl font-light">Client: <span
                            className="font-thin">{booking.clientName}</span></p>
                        <div className="flex justify-between items-center text-black text-lg mt-5">
                            <button
                                onClick={() => handleAcceptedNotification(booking)}
                                className="border border-green-500 hover:bg-green-100 text-green-500 font-bold py-1 px-2 rounded-lg transition duration-300">
                                Accept
                            </button>
                            <button
                                onClick={() => handleDeclinedNotification(booking)}
                                className="border border-red-500 hover:bg-red-100 text-red-500 font-bold py-1 px-2 rounded-lg transition duration-300">
                                Decline
                            </button>
                        </div>
                    </animated.div>
                )))
            }
        </div>
    );
}

export default NotificationContent;
