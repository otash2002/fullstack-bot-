import React from 'react'; // useMemo ishlatilmagani uchun olib tashladik
import { CartItem } from '../types';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import AnimatedNumber from './AnimatedNumber';
import { useTelegram } from '../hooks/useTelegram'; // 1. Hookni import qiling

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (itemId: number, newQuantity: number) => void;
    total: number;
    onOrder: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, total, onOrder, isOpen, onClose }) => {
    const { onSendData } = useTelegram(); // 2. Hookdan funksiyani oling

    // 3. Botga ma'lumot yuborish funksiyasi
    const handleOrderClick = () => {
        if (items.length === 0) return;

        const data = {
            items: items.map(item => ({
                id: item.itemId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total_amount: total // Backend kutilayotgan nom
        };

        onSendData(data); // Telegramga ma'lumot ketdi!
        onOrder(); // Agar prop orqali boshqa ishlar bo'lsa, ularni ham bajaradi
    };
    
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4" onClick={onClose}>
            {/* ... (oldingi kodlar) ... */}
            
            <button 
                onClick={handleOrderClick} // 4. Yangi funksiyani bog'lang
                disabled={items.length === 0}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 rounded-lg text-lg transition-transform duration-200 hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                Buyurtma berish
            </button>
            
            {/* ... (qolgan kodlar) ... */}
        </div>
    );
};

export default Cart;