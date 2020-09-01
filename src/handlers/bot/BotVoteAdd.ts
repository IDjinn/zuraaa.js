import { IPacket } from "../Index";
import ZuraaaJs from "../../Index";
import { IPayload } from "../../util/Payload";

export default class BotPacket implements IPacket {
    constructor(private core: ZuraaaJs) { }

    public async parse(payload: IPayload) {
        const { bot: botId, votes, user: userId } = payload.d;
        if (!botId || !votes || !userId)
            return;

        const bot = await this.core.cache.fetchBot(botId);
        const user = await this.core.cache.fetchUser(userId);
        this.core.emit('onBotVoteAdd', bot, user, votes);
    }
}