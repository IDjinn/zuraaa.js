import { IPacket } from "../Index";
import Client from "../../Index";
import { IPayload } from "../../util/Payload";

export default class BotPacket implements IPacket {
    constructor(private core: Client) { }

    public async parse(payload: IPayload) {
        const { bot: botId, votes, user: userId } = payload.d;
        if (!botId || !votes || !userId)
            return;

        const bot = await this.core.cache.fetchBot(botId);
        const user = await this.core.cache.fetchUser(userId);
        if (!bot || !user)
            return;

        this.core.emit('botVoteAdd', bot, user, votes);
    }
}