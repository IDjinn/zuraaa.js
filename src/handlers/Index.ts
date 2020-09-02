import Client from "../Index";
import { IPayload, Event } from "../util/Payload";
import { Collection } from "discord.js";
import BotVoteAdd from './bot/BotVoteAdd';


export default class PacketsHandler {
    private readonly packets: Collection<Event, IPacket> = new Collection();
    constructor(private core: Client) {
        this.packets.set(Event.BOT_VOTE_ADD, new BotVoteAdd(this.core))
    }

    public handlePacket(payload: IPayload) {
        let packet = this.packets.get(payload.t || -1);
        if (packet)
            packet.parse(payload);
    }
}

export interface IPacket {
    parse(payload: IPayload): void;
}