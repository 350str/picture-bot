import { Telegraf } from "telegraf";
import axios from "axios";

const BOT_TOKEN = "5185567248:AAElRXhOlS7GuHEmvPVREOcHGLwN-TzVJ5g";
const CUSTOM_SEARCH_API_TOKEN = "AIzaSyC2XepoGko7Dz49maG-3Xh5b0XjVlw_vmI";
const SEARCH_API_ID = "4114a49481b949f48";

const bot = new Telegraf(BOT_TOKEN);

interface SearchInfo {
  items?: {
    link: string;
  }[];
}

const getSearchInfo = async (query: string) => {
  const response = await axios(`https://www.googleapis.com/customsearch/v1`, {
    params: {
      key: CUSTOM_SEARCH_API_TOKEN,
      cx: SEARCH_API_ID,
      searchType: "image",
      q: query,
      filter: 0,
      imgSize: "medium",
    },
  });

  return response.data as Promise<SearchInfo>;
};

bot.start((ctx) =>
  ctx.reply(
    "Привет! Я бот который генерирует картинки. Напишите, пожалуйста, что вы хотели бы найти"
  )
);

bot.help((ctx) =>
  ctx.reply(
    "Привет! Я бот который генерирует картинки. Напишите, пожалуйста, что вы хотели бы найти"
  )
);

bot.on("message", async (ctx) => {
  if ("text" in ctx.update.message) {
    try {
      const data = await getSearchInfo(ctx.update.message.text);
      if (data.items?.length) {
        await ctx.replyWithMediaGroup(
          data.items.map(({ link }) => ({
            type: "photo",
            media: link,
          }))
        );
      } else {
        throw new Error(
          "По данному запросу ничего не найдено. Пожалуйста, попробуйте еще раз"
        );
      }
    } catch (e) {
      if (e instanceof Error) {
        ctx.reply(e.message);
      } else {
        ctx.reply("Неизвестаня ошибка. Пожалуйста, попробуйте еще раз");
      }
    }
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
