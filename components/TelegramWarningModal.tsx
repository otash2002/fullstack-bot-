import React from 'react';

interface TelegramWarningModalProps {
    isOpen: boolean;
    onClose: () => void;
    botUsername: string;
}

const TelegramWarningModal: React.FC<TelegramWarningModalProps> = ({ isOpen, onClose, botUsername }) => {
    if (!isOpen) {
        return null;
    }

    const botLink = `https://t.me/${botUsername}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl animate-fade-in-up text-center p-6" onClick={e => e.stopPropagation()}>
                <div className="text-yellow-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Diqqat!</h3>
                <p className="text-gray-300 mb-6">
                    Buyurtma berish uchun, iltimos, ushbu ilovani Telegram orqali oching.
                </p>
                <a 
                    href={botLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-4 rounded-lg text-lg transition-transform duration-200 hover:scale-105 mb-3"
                >
                    Telegramda ochish
                </a>
                <button 
                    onClick={onClose}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform duration-200 active:scale-95"
                >
                    Yopish
                </button>
            </div>
        </div>
    );
};

export default TelegramWarningModal;
