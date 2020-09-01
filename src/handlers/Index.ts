import ZuraaaJs from "../Index";
import { IPayload, Event } from "../util/Payload";
import { Collection } from "discord.js";
import BotVoteAdd from './bot/BotVoteAdd';


export default class PacketsHandler {
    private packets: Collection<Event, IPacket> = new Collection();
    constructor(private core: ZuraaaJs) {
        this.packets.set(Event.BOT_VOTE_ADD, new BotVoteAdd(this.core))
    }

    public handlePacket(payload: IPayload) {

    }
}

export interface IPacket {
    parse(payload: IPayload): void;
}