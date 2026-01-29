
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, session, Context, SessionFlavor } from 'grammy';
import { PrismaService } from '../prisma/prisma.service';
import { MENU_DATA } from './menu-data'; // Import menu data

// ========================================
// INTERFEYSLAR
// ========================================

// Frontenddan keladigan ma'lumot strukturasi
interface WebAppOrderData {
  items: { id: number; quantity: number }[];
}

// Bot sessiyasida saqlanadigan to'liq savat ma'lumoti
interface CartData {
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total_price: number;
  }[];
  total_amount: number;
}

interface SessionData {
  cart: CartData | null;
  phone: string;
  orderType: string;
  location: { latitude: number; longitude: number } | null;
  addressText: string;
  lastAction: string;
}

type MyContext = Context & SessionFlavor<SessionData>;

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  private bot: Bot<MyContext>;
  private readonly ADMIN_ID: string;
 // Oxiridagi chiziqchaga e'tibor ber!
private readonly WEB_APP_URL = "https://otash2002.github.io/fullstack-bot-/";

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const botToken = this.configService.get<string>('BOT_TOKEN');
    this.ADMIN_ID = this.configService.get<string>('ADMIN_ID');

    if (!botToken || !this.ADMIN_ID) {
      throw new Error('BOT_TOKEN yoki ADMIN_ID .env faylida topilmadi!');
    }
    this.bot = new Bot<MyContext>(botToken);
  }

  async onModuleInit() {
    console.log('🤖 Bot sozlanmoqda...');
    this.bot.use(
      session({
        initial: (): SessionData => ({
          cart: null,
          phone: '',
          orderType: '',
          location: null,
          addressText: '',
          lastAction: 'menu',
        }),
      }),
    );
    this.setupHandlers();
    await this.bot.start({
      onStart: (botInfo) => console.log(`✅ Bot ishga tushdi: @${botInfo.username}`),
    });
  }

  async onModuleDestroy() {
    console.log('🛑 Bot to\'xtatilmoqda...');
    await this.bot.stop();
  }

  private setupHandlers() {
    this.bot.command('start', (ctx) => this.handleStart(ctx));
    this.bot.on('message:contact', (ctx) => this.handleContact(ctx));
    this.bot.callbackQuery('type_delivery', (ctx) => this.handleDeliveryType(ctx));
    this.bot.callbackQuery('type_pickup', (ctx) => this.handlePickupType(ctx));
    this.bot.on('message:location', (ctx) => this.handleLocation(ctx));
    this.bot.on('message:web_app_data', (ctx) => this.handleWebAppData(ctx));
    this.bot.on('message:text', (ctx) => this.handleText(ctx));
    this.bot.callbackQuery(/^accept_(\d+)$/, (ctx) => this.handleAcceptOrder(ctx));
    this.bot.callbackQuery(/^reject_(\d+)$/, (ctx) => this.handleRejectOrder(ctx));
    this.bot.callbackQuery(/^contact_(\d+)$/, (ctx) => this.handleContactAdmin(ctx));
    this.bot.catch((err) => console.error('❌ Bot global xatosi:', err));
  }

  private async handleStart(ctx: MyContext) {
    ctx.session = { cart: null, phone: '', orderType: '', location: null, addressText: '', lastAction: 'registration' };
    await this.prisma.user.upsert({
      where: { telegramId: ctx.from.id.toString() },
      update: {},
      create: {
        telegramId: ctx.from.id.toString(),
        name: ctx.from.first_name || 'Foydalanuvchi',
      },
    });
    await this.askForMissingInfo(ctx);
  }

 private async handleContact(ctx: MyContext) {
  if (!ctx.message?.contact) return;
  
  const phone = ctx.message.contact.phone_number.replace('+', '');
  ctx.session.phone = phone;

  // update o'rniga upsert ishlatamiz
  await this.prisma.user.upsert({
    where: { telegramId: ctx.from.id.toString() },
    update: { phone },
    create: {
      telegramId: ctx.from.id.toString(),
      phone: phone,
      name: ctx.from.first_name, // Ismini ham saqlab ketamiz
    },
  });

  await this.askForMissingInfo(ctx);
}
  
  private async handleDeliveryType(ctx: MyContext) {
    ctx.session.orderType = 'Yetkazib berish';
    await ctx.answerCallbackQuery();
    await ctx.editMessageText('📍 *Yetkazib berish tanlandi*', { parse_mode: 'Markdown' });
    await this.askForMissingInfo(ctx);
  }

  private async handlePickupType(ctx: MyContext) {
    ctx.session.orderType = 'Olib ketish';
    ctx.session.location = null;
    ctx.session.addressText = 'Filialdan olib ketish';
    ctx.session.lastAction = 'menu';
    await ctx.answerCallbackQuery();
    await ctx.editMessageText('🛍 *Olib ketish tanlandi*', { parse_mode: 'Markdown' });

    if (ctx.session.cart) {
        await this.finalizeOrder(ctx);
    } else {
        await this.sendMainMenu(ctx, '✅ Ma\'lumotlaringiz saqlandi.\n\nEndi "🍴 Menyu" tugmasi orqali buyurtma bering 👇');
    }
  }

  private async handleLocation(ctx: MyContext) {
    if (ctx.session.lastAction !== 'waiting_location' || !ctx.message?.location) return;
    ctx.session.location = { latitude: ctx.message.location.latitude, longitude: ctx.message.location.longitude };
    ctx.session.addressText = 'Xaritadagi lokatsiya yuborildi';
    ctx.session.lastAction = 'menu';
    
    if (ctx.session.cart) {
        await this.finalizeOrder(ctx);
    } else {
        await this.sendMainMenu(ctx, '✅ Manzil qabul qilindi!\n\nEndi "🍴 Menyu" tugmasi orqali buyurtma bering 👇');
    }
  }
  
  private async handleWebAppData(ctx: MyContext) {
    if (!ctx.message?.web_app_data?.data) return;
    try {
      const webAppData: WebAppOrderData = JSON.parse(ctx.message.web_app_data.data);
      if (!webAppData.items || webAppData.items.length === 0) {
        await ctx.reply('❌ Savatingiz bo\'sh!');
        return;
      }

      // --- Backendda savatni qayta qurish (XAVFSIZLIK UCHUN) ---
      const reconstructedCart: CartData = { items: [], total_amount: 0 };
      for (const item of webAppData.items) {
          const menuItem = MENU_DATA.find(p => p.id === item.id);
          if (menuItem && item.quantity > 0) {
              reconstructedCart.items.push({
                  id: menuItem.id,
                  name: menuItem.name,
                  quantity: item.quantity,
                  price: menuItem.price,
                  total_price: menuItem.price * item.quantity,
              });
              reconstructedCart.total_amount += menuItem.price * item.quantity;
          }
      }

      if (reconstructedCart.items.length === 0) {
        await ctx.reply('❌ Savatda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
        return;
      }
      
      ctx.session.cart = reconstructedCart;
      // -------------------------------------------------------------

      const user = await this.prisma.user.findUnique({ where: { telegramId: ctx.from.id.toString() } });
      const phone = user?.phone || ctx.session.phone;
      const { orderType, addressText } = ctx.session;

      const isFullyRegistered = phone && orderType && (orderType === 'Olib ketish' || addressText);

      if (isFullyRegistered) {
        await this.finalizeOrder(ctx);
      } else {
        await ctx.reply(
            '🛒 Savatingizni qabul qildik!\n\n' +
            'Buyurtmani yakunlash uchun, iltimos, ro\'yxatdan o\'tishni yakunlang.'
        );
        await this.askForMissingInfo(ctx);
      }
    } catch (error) {
      console.error("Web App Data xatosi:", error);
      await ctx.reply('❌ Buyurtma ma\'lumotlarini o\'qishda xatolik yuz berdi.');
    }
  }


  private async handleText(ctx: MyContext) {
    const text = ctx.message?.text;
    if (!text) return;

    if (ctx.session.lastAction === 'waiting_location' && text !== '🔙 Bekor qilish') {
      ctx.session.addressText = text;
      ctx.session.location = null;
      ctx.session.lastAction = 'menu';
      
      if (ctx.session.cart) {
        await this.finalizeOrder(ctx);
      } else {
        await this.sendMainMenu(ctx, `✅ Manzil qabul qilindi: *${text}*\n\nEndi "🍴 Menyu" tugmasi orqali buyurtma berishingiz mumkin.`);
      }
      return;
    }

    switch (text) {
      case '🔄 Qayta boshlash': case '🔙 Bekor qilish': await this.handleStart(ctx); break;
      case '📞 Aloqa': await ctx.reply('☎️ +998 94 677 75 90\n📍 Chartak sh., Alisher Navoiy ko\'chasi'); break;
      case '🛒 Savat': await ctx.reply('Savatdagi mahsulotlarni ko\'rish va buyurtma berish uchun "🍴 Menyu" tugmasini bosing.'); break;
    }
  }
  
  private async askForMissingInfo(ctx: MyContext) {
    const user = await this.prisma.user.findUnique({ where: { telegramId: ctx.from.id.toString() } });
    
    if (!user?.phone) {
        await ctx.reply('Iltimos, telefon raqamingizni yuboring:', {
            reply_markup: {
                keyboard: [[{ text: '📞 Raqamni yuborish', request_contact: true }]],
                resize_keyboard: true, one_time_keyboard: true,
            },
        });
    } else if (!ctx.session.orderType) {
        await ctx.reply('Endi xizmat turini tanlang:', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🚖 Yetkazib berish', callback_data: 'type_delivery' }, { text: '🛍 Olib ketish', callback_data: 'type_pickup' }],
                ],
            },
        });
    } else if (ctx.session.orderType === 'Yetkazib berish' && !ctx.session.addressText) {
        ctx.session.lastAction = 'waiting_location';
        await ctx.reply('Manzilni yuborish uchun *Lokatsiyani yuborish* tugmasini bosing yoki manzilni *matn ko\'rinishida yozib yuboring*:', {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [[{ text: '📍 Lokatsiyani yuborish', request_location: true }], [{ text: '🔙 Bekor qilish' }]],
                resize_keyboard: true,
            },
        });
    }
  }

  private async finalizeOrder(ctx: MyContext) {
    const { cart } = ctx.session;
    if (!cart?.items?.length) {
      await ctx.reply('❌ Savatingiz bo\'sh. Iltimos, menyudan tanlang.');
      return;
    }

    const user = await this.prisma.user.findUnique({ where: { telegramId: ctx.from.id.toString() } });
    if (!user) {
      await ctx.reply('❌ Foydalanuvchi topilmadi. /start buyrug\'ini bosing.');
      return;
    }
    
    const order = await this.prisma.order.create({
data: {
  // 1. Foydalanuvchini ID orqali bog'laymiz (user o'zgaruvchisidan olamiz)
  user: { connect: { id: user.id } }, 
  
  // 2. Telefon raqami (user ob'ekti ichida bor deb hisoblaymiz)
  userPhone: user.phone || "Raqam kiritilmagan", 
  
  // 3. Umumiy summa (cart ob'ekti ichidagi totalAmount yoki totalPrice)
 totalAmount: Number(cart.total_amount || 0),
  
  // 4. Savatchadagi mahsulotlar (cart.items bu yerda massiv bo'lishi kerak)
  items: {
    create: cart.items.map((item: any) => ({
      productName: item.title || item.name,
      quantity: Number(item.quantity),
      price: Number(item.price),
    })),
  },
},
    });

    let orderSummary = `🚀 *Yangi buyurtma #${order.id}!*\n\n`;
    orderSummary += `👤 *Mijoz:* ${ctx.from.first_name || 'Noma\'lum'}\n`;
    orderSummary += `📞 *Telefon:* +${user.phone || ctx.session.phone}\n`;
    orderSummary += `🚚 *Turi:* ${ctx.session.orderType}\n`;
    orderSummary += `📍 *Manzil:* ${ctx.session.addressText}\n\n`;
    cart.items.forEach(item => {
      orderSummary += `- ${item.name} | ${item.quantity} ta = ${item.total_price.toLocaleString()} so'm\n`;
    });
    orderSummary += `\n💰 *JAMI: ${cart.total_amount.toLocaleString()} so'm*`;

    await this.bot.api.sendMessage(this.ADMIN_ID, orderSummary, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Qabul qilish', callback_data: `accept_${order.id}` }, { text: '❌ Rad etish', callback_data: `reject_${order.id}` }],
          [{ text: '📞 Aloqa', callback_data: `contact_${user.telegramId}` }],
        ],
      },
    });

    if (ctx.session.location) {
      await this.bot.api.sendLocation(this.ADMIN_ID, ctx.session.location.latitude, ctx.session.location.longitude);
    }
    
    await ctx.reply(`✅ *Buyurtmangiz #${order.id} qabul qilindi!*\n💰 Jami: ${cart.total_amount.toLocaleString()} so'm\n\nTez orada siz bilan bog'lanamiz.`, {
      parse_mode: 'Markdown',
    });
    
    ctx.session.cart = null; // Savatni tozalaymiz
    await this.sendMainMenu(ctx, 'Yangi buyurtma berish uchun "🍴 Menyu" tugmasini bosing.');
  }

  private async sendMainMenu(ctx: MyContext, text: string) {
    await ctx.reply(text, {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [[{ text: '🍴 Menyu', web_app: { url: this.WEB_APP_URL } }], [{ text: '🔄 Qayta boshlash' }, { text: '📞 Aloqa' }]],
        resize_keyboard: true,
      },
    });
  }

  private async handleAcceptOrder(ctx: MyContext) {
    const orderId = parseInt(ctx.match[1]);
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'accepted' },
      include: { user: true },
    });
    await ctx.answerCallbackQuery('✅ Qabul qilindi');
    await this.bot.api.sendMessage(order.user.telegramId, `✅ *Sizning #${order.id} buyurtmangiz qabul qilindi!*\n💰 Summa: ${order.totalAmount.toLocaleString()} so'm\n⏰ Tez orada yetkazamiz.`, { parse_mode: 'Markdown' });
    await ctx.editMessageText(ctx.callbackQuery.message.text + '\n\n✅ *STATUS: QABUL QILINDI*', { parse_mode: 'Markdown' });
  }

  private async handleRejectOrder(ctx: MyContext) {
    const orderId = parseInt(ctx.match[1]);
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'rejected' },
      include: { user: true },
    });
    await ctx.answerCallbackQuery('❌ Rad etildi');
    await this.bot.api.sendMessage(order.user.telegramId, `❌ *Kechirasiz, #${order.id} buyurtmangiz rad etildi.* Sababini aniqlashtirish uchun biz bilan bog'laning.`, { parse_mode: 'Markdown' });
    await ctx.editMessageText(ctx.callbackQuery.message.text + '\n\n❌ *STATUS: RAD ETILDI*', { parse_mode: 'Markdown' });
  }

  private async handleContactAdmin(ctx: MyContext) {
    const telegramId = ctx.match[1];
    const user = await this.prisma.user.findUnique({ where: { telegramId } });
    await ctx.answerCallbackQuery();
    await ctx.reply(`📞 Mijoz: +${user?.phone || 'Noma\'lum'}`);
  }
}
