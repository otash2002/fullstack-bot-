import { useState, useEffect } from 'react';
import { TelegramWebApp } from '../types';

declare global {
    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }
}

export function useTelegram() {
    const [tg, setTg] = useState<TelegramWebApp | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const webApp = window.Telegram.WebApp;
            webApp.ready(); // Telegramga tayyorligimizni bildiramiz
            setTg(webApp);
        }
    }, []);

    const onSendData = (data: any) => {
        if (tg) {
            tg.sendData(JSON.stringify(data)); // Ma'lumotni botga yuborish
        }
    };

    return {
        tg,
        user: tg?.initDataUnsafe?.user,
        queryId: tg?.initDataUnsafe?.query_id,
        onSendData, // Buni eksport qilamiz
    };
}