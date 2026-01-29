import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-slate-900 text-white">
            <div className="container mx-auto px-4 py-6 flex items-center justify-center text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                    <span className="text-white">Presto</span>
                    <span className="text-yellow-500"> Pizza</span>
                </h1>
            </div>
        </header>
    );
};

export default Header;