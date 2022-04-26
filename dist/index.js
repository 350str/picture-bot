"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const axios_1 = __importDefault(require("axios"));
const BOT_TOKEN = "5185567248:AAElRXhOlS7GuHEmvPVREOcHGLwN-TzVJ5g";
const CUSTOM_SEARCH_API_TOKEN = "AIzaSyC2XepoGko7Dz49maG-3Xh5b0XjVlw_vmI";
const SEARCH_API_ID = "4114a49481b949f48";
const bot = new telegraf_1.Telegraf(BOT_TOKEN);
const getSearchInfo = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, axios_1.default)(`https://www.googleapis.com/customsearch/v1`, {
        params: {
            key: CUSTOM_SEARCH_API_TOKEN,
            cx: SEARCH_API_ID,
            searchType: "image",
            q: query,
        },
    });
    return (yield response.data);
});
bot.start((ctx) => ctx.reply("Привет! Я бот который генерирует картинки. Напишите, пожалуйста, что вы хотели бы найти"));
bot.help((ctx) => ctx.reply("Привет! Я бот который генерирует картинки. Напишите, пожалуйста, что вы хотели бы найти"));
bot.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ("text" in ctx.update.message) {
        try {
            const data = yield getSearchInfo(ctx.update.message.text);
            if ((_a = data.items) === null || _a === void 0 ? void 0 : _a.length) {
                yield ctx.replyWithMediaGroup(data.items.map(({ link }) => ({
                    type: "photo",
                    media: link,
                })));
            }
            else {
                throw new Error("по данному запросу ничего не найдено");
            }
        }
        catch (e) {
            if (e instanceof Error) {
                ctx.reply(`Возникла ошибка - ${e.message}. Пожалуйста, попробуйте еще раз`);
            }
            else {
                ctx.reply("Неизвестаня ошибка. Пожалуйста, попробуйте еще раз");
            }
        }
    }
}));
bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
