import {useParams} from "react-router-dom";
import {validateUserId} from "../hooks/validateUserId";
import ClipLoader from "react-spinners/ClipLoader";
import React from "react";
import {TBookingRouteProps} from "../types/props/TBookingRouteProps";

const BookingRoute: React.FC<TBookingRouteProps> = ({component: Component}) => {
    const {id} = useParams<{ id: string }>();
    const {decodedId, isUserIdValid, loading} = validateUserId({encodedId: id});

    if (loading) {
        return (
            <div className="loading-spinner">
                <ClipLoader color="#3f51b5" size={50}/>
            </div>
        );
    }

    // TODO: Add a better way to handle invalid user id urls
    return (isUserIdValid && decodedId) ? <Component id={decodedId}/> :
        <div className="p-5 flex justify-center items-center text-xl">Service Provider Does Not Exist</div>;
};

export default BookingRoute;