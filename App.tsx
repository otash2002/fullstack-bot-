import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MenuItem, CartItem, Category } from './types';
import { MENU_DATA, CATEGORIES } from './data/menu';
import { useTelegram } from './hooks/useTelegram';
import Header from './components/Header';
import MenuItemGrid from './components/PizzaMenu';
import Cart from './components/Cart';
import CategoryTabs from './components/CategoryTabs';
import ShoppingCartIcon from './components/icons/ShoppingCartIcon';
import AnimatedNumber from './components/AnimatedNumber';
import TelegramWarningModal from './components/TelegramWarningModal';

const App: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category>('Barchasi');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showTelegramWarning, setShowTelegramWarning] = useState(false);
    const { tg, user } = useTelegram();

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        setCartItems(prevItems => {
            if (newQuantity <= 0) {
                return prevItems.filter(item => item.itemId !== itemId);
            }
            const existingItem = prevItems.find(item => item.itemId === itemId);
            if (existingItem) {
                return prevItems.map(item =>
                    item.itemId === itemId ? { ...item, quantity: newQuantity } : item
                );
            } else {
                const itemToAdd = MENU_DATA.find(item => item.id === itemId);
                if (!itemToAdd) return prevItems;
                return [...prevItems, {
                    itemId: itemToAdd.id,
                    name: itemToAdd.name,
                    quantity: newQuantity,
                    price: itemToAdd.price,
                    image: itemToAdd.image,
                }];
            }
        });
    };
    
    const totalItems = useMemo(() => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const handleOrder = useCallback(() => {
        if (!tg) {
            setShowTelegramWarning(true);
            return;
        };

        // Send only item IDs and quantities for security
        // The backend will calculate the total price based on its own data
        const orderData = {
            items: cartItems.map(item => ({
                id: item.itemId,
                quantity: item.quantity,
            })),
        };

        tg.sendData(JSON.stringify(orderData));
        tg.close();
        
    }, [cartItems, tg]);

    useEffect(() => {
        if (!tg) return;
        tg.ready();
    }, [tg]);

     useEffect(() => {
        if (!tg) return;

        if (cartItems.length > 0) {
            tg.MainButton.setText(`Rasmiylashtirish | ${cartTotal.toLocaleString()} UZS`);
            tg.MainButton.show();
            tg.MainButton.onClick(handleOrder);
        } else {
            tg.MainButton.hide();
        }

        return () => {
            if (tg) {
                tg.MainButton.offClick(handleOrder);
            }
        };
    }, [cartItems, cartTotal, handleOrder, tg]);

    const filteredMenu = useMemo(() => {
        if (activeCategory === 'Barchasi') {
            return MENU_DATA;
        }
        return MENU_DATA.filter(item => item.category === activeCategory);
    }, [activeCategory]);


    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans">
            <Header />
            <CategoryTabs categories={CATEGORIES} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
            <main className="container mx-auto px-4 py-8 pb-32">
                <div className="flex items-center mb-6">
                    <div className="w-1.f5 h-8 bg-yellow-400 mr-4"></div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-yellow-400 uppercase">{activeCategory}</h2>
                </div>
                
                <MenuItemGrid 
                    items={filteredMenu} 
                    onUpdateQuantity={handleQuantityChange}
                    cartItems={cartItems}
                />
            </main>

            {cartItems.length > 0 && (
                 <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 bg-yellow-500 text-slate-900 rounded-full shadow-lg z-30 flex items-center py-3 px-5 transition-transform duration-300 hover:scale-110 animate-fade-in-up"
                >
                    <ShoppingCartIcon className="w-6 h-6" />
                    <span className="ml-3 font-bold text-lg">{totalItems}</span>
                    <div className="w-px h-6 bg-yellow-600 mx-3"></div>
                    <span className="font-extrabold text-lg">
                        <AnimatedNumber value={cartTotal} formatter={(v) => v.toLocaleString()} /> UZS
                    </span>
                </button>
            )}
            
            <Cart 
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems} 
                onUpdateQuantity={handleQuantityChange} 
                total={cartTotal}
                onOrder={handleOrder}
            />
            <TelegramWarningModal
                isOpen={showTelegramWarning}
                onClose={() => setShowTelegramWarning(false)}
                botUsername="prestopizza_chartak_bot"
            />
        </div>
    );
};

export default App;