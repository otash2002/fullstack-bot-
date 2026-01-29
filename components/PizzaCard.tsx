
import React from 'react';
import { MenuItem } from '../types';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import AnimatedNumber from './AnimatedNumber';

interface MenuItemCardProps {
    item: MenuItem;
    quantity: number;
    onUpdateQuantity: (itemId: number, newQuantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, quantity, onUpdateQuantity }) => {
    const isInCart = quantity > 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateQuantity(item.id, 1);
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateQuantity(item.id, quantity + 1);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateQuantity(item.id, quantity - 1);
    };

    return (
        <div 
            className={`bg-slate-800 rounded-lg overflow-hidden shadow-lg flex flex-col text-center transition-all duration-300 ease-in-out border-2 ${isInCart ? 'border-yellow-400' : 'border-transparent'} hover:shadow-yellow-400/20`}
        >
            <div className="relative aspect-square">
                <img className="absolute h-full w-full object-cover" src={item.image} alt={item.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            </div>
            <div className="p-2 sm:p-4 flex flex-col flex-grow">
                <h3 className="text-sm sm:text-lg font-bold text-white flex-grow mb-2 sm:mb-4">{item.name}</h3>
                
                <div className="mt-auto">
                    {quantity === 0 ? (
                        <button 
                            onClick={handleAddToCart}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-yellow-400 border-2 border-yellow-600 font-bold py-2 px-2 text-xs sm:py-3 sm:px-4 sm:text-base rounded-lg transition-all duration-200 active:scale-95"
                        >
                           <AnimatedNumber value={item.price} formatter={(val) => val.toLocaleString()} /> UZS
                        </button>
                    ) : (
                        <div className="flex items-center justify-center bg-slate-700 rounded-full">
                            <button onClick={handleDecrease} className="p-2 sm:p-3 text-white hover:text-yellow-500 rounded-full transition-transform active:scale-90">
                                <MinusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <span className="px-2 sm:px-4 text-lg sm:text-xl font-bold text-white w-8 sm:w-12 text-center">{quantity}</span>
                            <button onClick={handleIncrease} className="p-2 sm:p-3 text-white hover:text-yellow-500 rounded-full transition-transform active:scale-90">
                                <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard;