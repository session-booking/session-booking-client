import React, {useState, useEffect, ChangeEvent, useRef} from 'react';
import {TSliderProps} from "../types/props/TSliderProps";

function Slider({value, onChange}: TSliderProps) {
    const [displayValue, setDisplayValue] = useState<number>(value);
    const [isSliding, setIsSliding] = useState<boolean>(false);

    const sliderRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    const handleMouseDown = () => {
        setIsSliding(true);
    };

    const handleMouseUp = () => {
        setIsSliding(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setDisplayValue(newValue);
        onChange(newValue);
    };

    const getThumbPosition = () => {
        if (sliderRef.current) {
            const range = sliderRef.current;
            const ratio = (Number(range.value) - Number(range.min)) / (Number(range.max) - Number(range.min));
            return ratio * 100 - displayValue * 0.58;
        }
        return 0;
    };

    return (
        <div className="slider-container mt-6">
            <div
                className={`slider-value ${isSliding ? 'visible' : ''} font-thin`}
                style={{left: `${getThumbPosition()}%`}}
            >
                {`${displayValue * 15}m`}
            </div>
            <input
                ref={sliderRef}
                type="range"
                min="0"
                max="16"
                value={displayValue}
                className="slider"
                onChange={handleChange}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
            />
        </div>
    );
}

export default Slider;
