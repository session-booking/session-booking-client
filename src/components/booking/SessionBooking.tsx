import React, {FormEvent, useEffect, useState} from 'react';
import {TService} from "../../types/TService";
import ServiceApi from "../../api/ServiceApi";
import {TSessionBookingProps} from "../../types/props/TSessionBookingProps";
import LogApi from "../../api/LogApi";
import {FaRegClock} from "react-icons/all";
import "../../SessionBooking.css";

const steps = ['Select a Service', 'Select the Day and Time', 'Confirm Booking'];

function SessionBooking({id}: TSessionBookingProps) {
    // Form step state
    const [step, setStep] = useState<number>(1);

    // Service provider services state
    const [services, setServices] = useState<TService[]>([]);

    // Selected service state
    const [selectedService, setSelectedService] = useState<number | undefined>(undefined);

    // Error message state
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        async function fetchServices() {
            const allServices = await ServiceApi.getServices(Number(id));
            setServices(allServices);
        }

        async function fetchTimeSlots() {

        }

        fetchServices().catch((error) => {
            LogApi.logError(error.toString(), null);
        });

    }, []);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step === 1 && !selectedService) {
            setErrorMessage('Please select a service before continuing.');
        } else {
            setErrorMessage(undefined);
            if (step < 3) {
                setStep(step + 1);
            } else {
                // Submit form
            }
        }
    };

    const goBack = () => {
        if (step > 1) setStep(step - 1);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="w-full max-w-[50%] p-6 m-4 bg-white rounded-md shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <p className="font-light text-md uppercase">step: {step} of 3</p>
                        <h1 className="text-xl font-normal">{steps[step - 1]}</h1>
                    </div>
                    <div className="max-w-xs w-full flex justify-end mt-4">
                        <div className="w-full bg-gray-300 rounded-full h-2.5 mt-[10px]">
                            <div className="rounded-full bg-green-500 leading-none h-2.5 text-center text-white"
                                 style={{width: `${(step / steps.length) * 100}%`}}></div>
                        </div>
                        <span className="text-lg text-gray-700 ml-2">{Math.round((step / steps.length) * 100)}%</span>
                    </div>
                </div>

                <hr/>

                <form onSubmit={onSubmit} className="mt-6">
                    {errorMessage && (
                        <div className="mb-4 text-red-500 flex justify-center">{errorMessage}</div>
                    )}

                    {step === 1 && (
                        <div className="flex flex-wrap justify-evenly">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => setSelectedService(service.id)}
                                    className={`service-card flex justify-between m-4 rounded-md text-gray-700 border border-gray-500
                                        ${selectedService === service.id ? 'bg-gray-300' : ''}
                                        hover:bg-gray-200 hover:scale-105 transition-all duration-100 cursor-pointer transform`}>
                                    <p className="p-2 font-normal mr-2 text-xl">{service.name}</p>
                                    <div className="flex justify-center p-2 items-center">
                                        <FaRegClock size={18} className="m-1"/>
                                        <span className="font-light text-lg">{service.length} min</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        {step !== 1 && (<button
                            className="px-4 py-2 text-white bg-gray-400 hover:bg-gray-500 rounded focus:outline-none
                            focus:shadow-outline transition duration-300 text-xl"
                            type="button" onClick={goBack} disabled={step === 1}>Previous</button>)}
                        <button
                            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded focus:outline-none
                            focus:shadow-outline ml-3 transition duration-300 text-xl"
                            type="submit">{step < 3 ? 'Next' : 'Confirm'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SessionBooking;
