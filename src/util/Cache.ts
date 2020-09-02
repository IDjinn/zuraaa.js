import { Collection } from "discord.js";
import Bot from "../structures/Bot";
import User from "../structures/User";
import fetch from 'node-fetch';
import Client from "../Index";


export default class Cache {
    private userCache = new Collection<string, User>();
    private botCache = new Collection<string, Bot>();
    constructor(private readonly core: Client) { }

    public async init(usersCount: number, botsCount: number) {
        this.core.debug('CACHE', 'Loading cache from users and bots');
        let after = 0;
        for (let i = 1; i <= usersCount; i++) {
            const res = await fetch(this.core.endpoints.users.fetch(100, after));
            if (!res.ok)
                continue;

            for (const userJson of await res.json()) {
                const user = new User(userJson, this.core);
                this.addToCache(user);
                after++;
            }
        }
        after = 0;
        for (let i = 1; i <= botsCount; i++) {
            const res = await fetch(this.core.endpoints.bots.fetch(100, after));
            if (!res.ok)
                continue;

            for (const botJson of await res.json()) {
                const bot = new Bot(botJson, this.core);
                this.addToCache(bot);
                after++;
            }
        }
        this.core.debug('CACHE', `Cache ready, ${this.botCache.size} bots and ${this.userCache.size} users!`);
    }

    public async fetchBot(id: string, cache = true) {
        if (cache && this.botCache.has(id))
            return this.botCache.get(id);

        const res = await fetch(this.core.endpoints.bots.id(id));
        if (!res.ok)
            return null;

        const bot = new Bot(await res.json(), this.core);
        this.addToCache(bot);
        return bot;
    }

    public async fetchUser(id: string, cache = true) {
        if (cache && this.botCache.has(id))
            return this.botCache.get(id);

        const res = await fetch(this.core.endpoints.users.id(id));
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