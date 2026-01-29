
import React from 'react';

const DrinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c4.142 0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5-7.5 3.358-7.5 7.5 3.358 7.5 7.5 7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5l-1.303-1.303" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7.5l1.303-1.303" />
    </svg>
);

export default DrinkIcon;
