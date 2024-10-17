require('dotenv').config()
const {Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');

const bot = new Bot(process.env.BOT_API_MODEL);
bot.use(hydrate());

/*
bot.on([':media', '::url', ':voice'], async (ctx) => {
   await ctx.reply('Надо подумать...')
});

bot.on(':photo').on('::hashtag', () => {

})


//можно создать фильтры и самому

bot.on('msg').filter((ctx) => {
    return ctx.from.id ===  
}, async (ctx) => {
    await ctx.reply('привет, админ')
})
*/
//msg заменяет message, edit заменяет editmessage,:media заменяет фото и видео


bot.api.setMyCommands([
    {
        command: 'start', 
        description: 'запуск бота',
    }, 
    {
        command: 'mood',
        description: 'Получить приветствие',
    },
    // {
    //     command: 'share',
    //     description: 'Убогий ',
    // },
    // {
    //     command: 'inline_keyboard',
    //     description: '123',
    // },
    {
        command: 'menu',
        description: 'получить меню',
    },
]);

 
// bot.command(['sayhello','hello','say_hi'], async (ctx) => {
//     await ctx.reply('hello!');
// })

// bot.on('msg', async (ctx) => {
//     console.log(ctx.msg); // from id username, me инфа о самом боте
// })
bot.command('start', async (ctx) => {
    await ctx.react('🌚')
    await ctx.reply('Привет я бот', {
        reply_parameters: {message_id: ctx.msg.message_id}
    });
})

const menuKeyboard = new InlineKeyboard().text('узнать статус заказ', 'order-status').text('обратиться в поддержку', 'support');
const backKeyboard = new InlineKeyboard().text('< назад в меню', 'back')
bot.command('menu', async (ctx) => {
    await ctx.reply('выберите пункт меню', {
        reply_markup: menuKeyboard,
    });
});

bot.callbackQuery('order-status', async (ctx) => {
    await ctx.callbackQuery.message.editText('status zakaza: v pitu', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuerry();
});

bot.callbackQuery('support', async (ctx) => {
    await ctx.callbackQuery.message.editText('напишите нам в поддержку', {
        reply_markup: backKeyboard,
    });
    await ctx.answerCallbackQuerry();
});

bot.callbackQuery('back', async (ctx) => {
    await ctx.callbackQuery.message.editText('назад в меню', {
        reply_markup: menuKeyboard,
    });
    await ctx.answerCallbackQuerry();
});

// bot.command('mood', async (ctx) => {
//     // const moodKeyboard = new Keyboard().text('okey').row().text('ok').row().text('pain').resized()
//     const moodLabels = ['okey', 'es', 'good']
//     const rows = moodLabels.map((label) => {
//         return [
//             Keyboard.text(label)
//         ]
//     })
//     const moodKeyboard2 = Keyboard.from(rows).resized()
//     await ctx.reply('как дела', {
//         reply_markup: moodKeyboard2
//     })
// })

// чтобы клавиатура изчезала после нажатие на кнопку нужно добавить .oneTime()

// bot.command('share', async (ctx) => {
//     const shareKeyboard = new Keyboard().requestLocation('гео').requestContact('контакт').
//     requestPoll('опрос').placeholder('укажи данные').resized()
//     await ctx.reply('чем хочешь поделиться', {
//         reply_markup: shareKeyboard
//     })
// })

// bot.command('inline_keyboard', async (ctx) => {
//     // const inlineKeyboard = new InlineKeyboard().text('1', 'button-1').row().text('2', 'button-2').row().text('3', 'button-3')
//     const inlineKeyboard2 = new InlineKeyboard().url('перейии в тг канал', 'https://www.instagram.com/accounts/onetap/?next=%2F')
//     await ctx.reply('выберите цифру', {
//         reply_markup: inlineKeyboard2,
//     })
// })

//  bot.callbackQuery(/button-[1-3]/, async (ctx) => {
//     await ctx.answerCallbackQuery('вы выбрали цифру!');
//     await ctx.reply(`вы нажали кнопку: ${ctx.callbackQuery.data}`);
// })
// bot.on('callback_query:data', async (ctx) => {
//     await ctx.answerCallbackQuery();
//     await ctx.reply('вы выбрали цифру');
// });

// bot.on(':contact', async (ctx) => {
//     await ctx.reply('спасибо')
// })

// bot.hears('okey', async (ctx) => {
//     await ctx.reply('заебись', {
//         reply_markup: {remove_keyboard: true}
//     })
// })

/*
bot.command('start', async (ctx) => {
    await ctx.reply('Привет я бот tg canal: <a>сыллка</a>', {
        parse_mode: 'HTML'
    });
})
*/


// bot.hears('id', async (ctx) => {
//     await ctx.reply(ctx.from.id);
// })
// bot.hears(['ping', 'page'], async (ctx) => {
//     await ctx.reply('pong')
// })


// (/пипец/) если добавить вместо массива то бот отрегагирует как маты если прописать нормально

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknowb:", e);
    }
}); 

bot.start();
