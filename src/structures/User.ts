import Client from "../Index";
import { User as DiscordUser } from 'discord.js';

export default class User {
    public readonly id: string;
    public readonly dates: IUserDates;
    public readonly details: IUserDetails;

    private dUser?: DiscordUser;
    constructor(json: any, private core: Client) {
        this.id = json.id;
        this.dates = json.dates;
        this.details = json.details;
    }

    public async init() {
        this.dUser = await this.core.client!.users.fetch(this.id, true);
        if (!this.dUser)
            throw 'Invalid user.';
    }

    get discordUser() {
        return this.dUser!;
    }
}

export interface IUserDates {
    firstSeen: Date,
    lastBotAdd: Date,
    nextVote: Date
}

export interface IUserDetails {
    customURL: string,
    bio: string
}