import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
    value: number;
    formatter: (value: number) => string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, formatter }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValueRef = useRef(value);
    // Fix: Initialize useRef with null to satisfy TypeScript's requirement for an initial value when a generic type is provided.
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const startValue = prevValueRef.current;
        const endValue = value;
        
        if (startValue === endValue) return;

        const duration = 300; // ms
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            const animatedValue = Math.floor(startValue + (endValue - startValue) * percentage);
            setDisplayValue(animatedValue);

            if (progress < duration) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                 setDisplayValue(endValue);
                 prevValueRef.current = endValue;
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if(frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [value]);

    return <span>{formatter(displayValue)}</span>;
};

export default AnimatedNumber;