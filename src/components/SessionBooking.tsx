import {useParams} from "react-router-dom";

function SessionBooking() {
    const {id} = useParams<{ id: string }>();

    return (
        <div>
            <h1>SessionBooking for user with id={id}</h1>
        </div>
    )
}

export default SessionBooking;