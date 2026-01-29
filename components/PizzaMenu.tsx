
import React from 'react';
import { MenuItem, CartItem } from '../types';
import MenuItemCard from './PizzaCard';

interface MenuItemGridProps {
    items: MenuItem[];
    onUpdateQuantity: (itemId: number, newQuantity: number) => void;
    cartItems: CartItem[];
}

const MenuItemGrid: React.FC<MenuItemGridProps> = ({ items, onUpdateQuantity, cartItems }) => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {items.map((item, index) => {
                const cartItem = cartItems.find(ci => ci.itemId === item.id);
                const quantity = cartItem ? cartItem.quantity : 0;
                return (
                     <div
                        key={item.id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
                     >
                        <MenuItemCard 
                            item={item} 
                            quantity={quantity} 
                            onUpdateQuantity={onUpdateQuantity} 
                        />
                     </div>
                );
            })}
        </div>
    );
};

export default MenuItemGrid;