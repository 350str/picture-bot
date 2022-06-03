import { Telegraf } from "telegraf";
import axios from "axios";
import "dotenv/config";

const bot = new Telegraf(process.env.BOT_TOKEN ?? "");

interface SearchInfo {
  items?: {
    link: string;
  }[];
}

const getSearchInfo = async (query: string) => {
  if (!process.env.CUSTOM_SEARCH_API_TOKEN || !process.env.SEARCH_API_ID) {
    throw new Error("env variables has not defined");
  }

  const response = await axios(`https://www.googleapis.com/customsearch/v1`, {
    params: {
      key: process.env.CUSTOM_SEARCH_API_TOKEN,
      cx: process.env.SEARCH_API_ID,
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
