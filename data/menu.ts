
import { MenuItem, Category } from '../types';

export const CATEGORIES: Category[] = ['Barchasi', 'Pizza', 'Hot-Dog', 'Sandwich', 'Lavash', 'Doner', 'Burger', 'Ichimliklar'];

export const MENU_DATA: MenuItem[] = [
    // Pizza
    { id: 1, name: "Pizza Pepperoni", category: 'Pizza', price: 70000, image: "https://otash2002.github.io/prezto_pizza_bot/img/peperonni.png" },
    { id: 2, name: "Pizza Pollo", category: 'Pizza', price: 75000, image: "https://otash2002.github.io/prezto_pizza_bot/img/pollo.png" },
    { id: 3, name: "Pizza Vetchina", category: 'Pizza', price: 75000, image: "https://avatars.mds.yandex.net/i?id=992fa77708ddfcbc1330a5f3319b0fbc76b7f726-12540459-images-thumbs&n=13" },
    { id: 4, name: "Pizza Carnoso", category: 'Pizza', price: 85000, image: "https://otash2002.github.io/prezto_pizza_bot/img/pitsagosht.png" },
    { id: 5, name: "Pizza 4 Type", category: 'Pizza', price: 90000, image: "https://otash2002.github.io/prezto_pizza_bot/img/PITSA4.png" },
    { id: 6, name: "Presto Pizza", category: 'Pizza', price: 100000, image: "https://otash2002.github.io/prezto_pizza_bot/img/presto.png" },
    
    // Hot-Dog
    { id: 7, name: "Hot-Dog Oddiy", category: 'Hot-Dog', price: 10000, image: "https://avatars.mds.yandex.net/i?id=246aa04abd613e368ee1047ba6e11343f8dbdd57-4232390-images-thumbs&n=13" },
    { id: 8, name: "Hot-Dog Canada", category: 'Hot-Dog', price: 13000, image: "https://avatars.mds.yandex.net/i?id=8ac48ba30280d094ad7138170f0682688b02ffb1-3518654-images-thumbs&n=13" },
    { id: 9, name: "Hot-Dog Canada 2x", category: 'Hot-Dog', price: 15000, image: "https://avatars.mds.yandex.net/i?id=fd5199baaaea7dc8b96ce54cbe792c99fe4aba84-5428196-images-thumbs&n=13" },
    { id: 10, name: "Chicken Hot-Dog", category: 'Hot-Dog', price: 18000, image: "https://avatars.mds.yandex.net/i?id=23f0b7aefdfb8e2573faa243dfdcf6683101d95b-4546582-images-thumbs&n=13" },
    { id: 11, name: "Go'shtli Hot-Dog", category: 'Hot-Dog', price: 20000, image: "https://avatars.mds.yandex.net/i?id=42e47a6f47445ea019c18e060d2a95409b8a8c3c-4220100-images-thumbs&n=13" },
    
    // Sandwich
    { id: 12, name: "Sandwich Indeyka", category: 'Sandwich', price: 35000, image: "https://otash2002.github.io/prezto_pizza_bot/img/donar.png" },
    { id: 13, name: "Sandwich Carnoso", category: 'Sandwich', price: 40000, image: "https://avatars.mds.yandex.net/i?id=f79ed8924f64c758df6a58b380915e35246f3de4-12514352-images-thumbs&n=13" },
    { id: 14, name: "Sandwich Pollo", category: 'Sandwich', price: 35000, image: "https://avatars.mds.yandex.net/i?id=9072b6b076c7bc84cbe324a854bef8a51ec18209-5679382-images-thumbs&n=13" },
    
    // Lavash
    { id: 15, name: "Lavash", category: 'Lavash', price: 25000, image: "https://avatars.mds.yandex.net/i?id=c06f400b649c1e2d323228922c8288bba382d67a-5177173-images-thumbs&n=13" },
    { id: 16, name: "Lavash Sirli", category: 'Lavash', price: 30000, image: "https://yukber.uz/image/cache/catalog/179ccd00e22-600x600.jpg" },

    // Doner
    { id: 17, name: "Doner", category: 'Doner', price: 25000, image: "https://otash2002.github.io/prezto_pizza_bot/img/donarr.png" },
    { id: 18, name: "Free", category: 'Doner', price: 18000, image: "https://avatars.mds.yandex.net/i?id=e18c4f8d87c317a827a82b0c8f9e29804b85ef0e-9263927-images-thumbs&n=13" },

    // Burger
    { id: 19, name: "Burger Oddiy", category: 'Burger', price: 15000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop" },
    { id: 20, name: "Chizburger", category: 'Burger', price: 17000, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop" },
    { id: 21, name: "Chicken Burger", category: 'Burger', price: 20000, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop" },
    { id: 22, name: "Double Burger", category: 'Burger', price: 25000, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop" },
    
    // Ichimliklar
    { id: 23, name: "Choy", category: 'Ichimliklar', price: 5000, image: "https://avatars.mds.yandex.net/i?id=d95b58a3fc4c60cc0e2c29c4e508f9ad8fdaf847-6478260-images-thumbs&n=13" },
    { id: 24, name: "Limonli Choy", category: 'Ichimliklar', price: 15000, image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&auto=format&fit=crop" },
    { id: 25, name: "Kofe Cappuchino", category: 'Ichimliklar', price: 5000, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop" },
    { id: 26, name: "Kofe 3v1", category: 'Ichimliklar', price: 3000, image: "https://avatars.mds.yandex.net/i?id=1a126b64f56ed01b06a13b2f8a6964ae00981a20-9146178-images-thumbs&n=13" }
];
