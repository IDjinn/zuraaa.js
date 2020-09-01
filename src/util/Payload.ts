export interface IPayload {
    op: OpCode;
    d: any;
    s?: number;
    t?: Event;
}

export enum Event {
    READY,
    BOT_CREATE,
    BOT_DELETE,
    BOT_UPDATE,
    BOT_VOTE_ADD
}


export function parsePayload(data: string) {
    return JSON.parse(data) as IPayload;
}

export function payloadToJson(data: IPayload) {
    try {
        return JSON.stringify({
            ...data
        })
    } catch (err) { }
}

export enum OpCode {
    Dispatch,
    Heartbeat,
    Identify,
    Resume,
    Reconnect,
    InvalidSession,
    Hello,
    HeartbeatACK,
}