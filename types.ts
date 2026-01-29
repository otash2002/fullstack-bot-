
export type Category = 'Barchasi' | 'Pizza' | 'Hot-Dog' | 'Sandwich' | 'Lavash' | 'Doner' | 'Burger' | 'Ichimliklar';

export interface MenuItem {
    id: number;
    name: string;
    category: Category;
    price: number;
    image: string;
    ingredients?: string;
}

export interface CartItem {
    itemId: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
}


export interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        query_id: string;
        user?: TelegramUser;
        receiver?: TelegramUser;
        chat?: TelegramChat;
        start_param?: string;
        can_send_after?: number;
        auth_date: number;
        hash: string;
    };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: ThemeParams;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    MainButton: MainButton;
    BackButton: BackButton;
    HapticFeedback: HapticFeedback;

    ready: () => void;
    expand: () => void;
    close: () => void;
    sendData: (data: string) => void;
    requestContact: (callback: (access: boolean) => void) => void;
    requestLocation: (callback: (access: boolean) => void) => void;
    onEvent: (eventType: string, eventHandler: () => void) => void;
    offEvent: (eventType: string, eventHandler: () => void) => void;
}

export interface TelegramUser {
    id: number;
    is_bot?: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
}

export interface TelegramChat {
    id: number;
    type: 'group' | 'supergroup' | 'channel';
    title: string;
    username?: string;
    photo_url?: string;
}


interface ThemeParams {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
}

interface MainButton {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (disable?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: { text?: string, color?: string, text_color?: string, is_active?: boolean, is_visible?: boolean }) => void;
}

interface BackButton {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
}

interface HapticFeedback {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
}
