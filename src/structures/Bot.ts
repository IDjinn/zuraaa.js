import Client from "../Index";
import { User } from "discord.js";

export default class Bot {
    public readonly id: string;
    public readonly description: string;
    public readonly votes: string;
    public readonly guilds: string;
    public readonly tags: string;

    private dUser?: User;
    constructor(json: any, private core: Client) {
        this.id = json.id;
        this.description = json.description;
        this.votes = json.votes;
        this.guilds = json.guilds;
        this.tags = json.tags;
        this.init();
    }

    public async init() {
        this.dUser = await this.core.client!.users.fetch(this.id);
        if (!this.dUser)
            throw 'Invalid bot';
    }

    get user() {
        return this.dUser!;
    }
}