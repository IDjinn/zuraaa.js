import { Collection } from "discord.js";
import Bot from "../structures/Bot";
import User from "../structures/User";
import fetch from 'node-fetch';
import ZuraaaJs from "../Index";


export default class Cache {
    private userCache = new Collection<string, User>();
    private botCache = new Collection<string, Bot>();
    constructor(private readonly core: ZuraaaJs) { }

    public async fetchBot(id: string, cache = true) {
        if (cache)
            return this.botCache.get(id);

        const res = await fetch(this.core.endpoints.bots().id(id));
        if (!res.ok)
            return null;

        const bot = new Bot(await res.json(), this.core);
        this.addToCache(bot);
        return bot;
    }

    public async fetchUser(id: string, cache = true) {
        if (cache)
            return this.botCache.get(id);

        const res = await fetch(this.core.endpoints.users().id(id));
        if (!res.ok)
            return null;

        const user = new User(await res.json(), this.core);
        this.addToCache(user);
        return user;
    }

    public addToCache(obj: User | Bot) {
        if (obj instanceof User)
            this.userCache.set(obj.id, obj);
        else if (obj instanceof Bot)
            this.botCache.set(obj.id, obj);
    }
}