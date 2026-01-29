
import React from 'react';

const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.836a.75.75 0 0 0-.73-.965H5.452L5.272 4.14A.75.75 0 0 0 4.5 3H2.25m7.5 15h.008v.008H9.75v-.008Zm4.5 0h.008v.008h-.008v-.008Z" />
    </svg>
);

export default ShoppingCartIcon;
