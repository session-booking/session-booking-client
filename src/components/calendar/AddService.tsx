import React, {useState} from "react";
import Slider from "./Slider";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import {TAddServiceProps} from "../../types/props/TAddServiceProps";
import {TService} from "../../types/TService";
import {AiOutlineMinusCircle} from "react-icons/ai";
import {BsDot, FaRegClock} from "react-icons/all";

function AddService({services, handleAddService, handleDeleteService}: TAddServiceProps) {
    const [service, setService] = useState<TService>({
        name: "",
        length: 0,
    });

    const handleAddServiceButtonClick = () => {
        handleAddService(service);

        setService({
            ...service,
            name: "",
            length: 0,
        })
    }

    const handleRemoveService = (service: TService) => {
        handleDeleteService(service);
    }

    function handleNameValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        setService({
            ...service,
            name: e.target.value,
        });
    }

    function handleLengthValueChange(value: number) {
        setService({
            ...service,
            length: value,
        });
    }

    return (
        <div className="p-4 items-center">
            <div className="max-w-xl">
                <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-light mb-4">Add or remove services</h2>
                    <div className="w-full">
                        <label className="text-black text-base font-light">
                            Service name
                            <input
                                value={service.name}
                                onChange={handleNameValueChange}
                                type="text"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base
                                        font-normal text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                placeholder="Enter service name"
                                required
                            />
                        </label>
                    </div>
                    <div className="w-full mt-5">
                        <label className="text-black text-base font-light">
                            Service time length
                            <Slider
                                value={service.length}
                                onChange={handleLengthValueChange}
                            />
                        </label>
                    </div>
                    <button onClick={handleAddServiceButtonClick}
                        className="rounded-md bg-blue-500 hover:bg-blue-600 py-3 px-8 text-center
                                        text-base font-normal text-white outline-none w-full mt-5"
                    >
                        Add service
                    </button>
                    <TransitionGroup>
                        {services.map((service, index) => (
                            <CSSTransition key={index} timeout={300} classNames="item">
                                <div className="flex flex-row justify-between items-center mt-2 bg-white rounded-lg shadow-md p-3">
                                    <div className="flex w-full items-center">
                                        <span className="font-normal text-lg truncate w-1/2">{service.name}</span>
                                        <BsDot size={24} />
                                        <div className="flex items-center w-1/2 justify-center">
                                            <FaRegClock size={18} className="mr-2"/>
                                            <span className="font-light text-md">{service.length} min</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveService(service)}
                                            className="text-red-500 hover:text-red-600 transition duration-200"
                                        >
                                            <AiOutlineMinusCircle size={24} />
                                        </button>
                                    </div>
                                </div>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </div>
            </div>
        </div>
    );
}

export default AddService;