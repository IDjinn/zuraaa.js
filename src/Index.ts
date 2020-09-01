import { Client } from 'discord.js';
import Websocket from 'ws';
import { parsePayload, OpCode, IPayload, payloadToJson, Events } from './util/Payload';
import from 'events';

export interface IOptions {
    secure: boolean | true;
    url: string;
    port: number | 80;
    debug: boolean | false;
}

export enum State {
    CONNECTING,
    CONNECTED,
    DISCONNECTED,
    DESTROYED
}

export default class ZuraaaJs extends EventEmitter {
    private ws: Websocket;
    private heartbeatInterval?: any;
    private state: State = State.CONNECTING;
    constructor(private options: IOptions, private client?: Client) {
        this.ws = new Websocket(`${options.secure ? 'wss' : 'ws'}://${options.url}:${options.port}`);

        this.ws.onopen = (event: Websocket.OpenEvent) => this.onOpen(event);
        this.ws.onclose = (event: Websocket.CloseEvent) => this.onClose(event);
        this.ws.onerror = (event: Websocket.ErrorEvent) => this.onError(event);
        this.ws.onmessage = (event: Websocket.MessageEvent) => this.onMessage(event);
    }

    private async onOpen(event: Websocket.OpenEvent) {
        this.debug('CORE', 'Websocket connected');
    }
    private async onClose(event: Websocket.CloseEvent) {
        this.debug('CORE', 'Websocket closed');
    }
    private async onError(event: Websocket.ErrorEvent) {
        this.debug('CORE', 'Websocket error', event.error);
    }
    private async onMessage(event: Websocket.MessageEvent) {
        this.debug('CORE', 'Websocket message', event.data);
        const payload = parsePayload(event.data.toString());

        switch (payload.op) {
            case OpCode.Hello:
                this.heartbeatInterval = setTimeout(() => {
                    this.send({ op: OpCode.Heartbeat, d: {} });
                }, payload.d.heartbeat_interval);

                this.send({ op: OpCode.Identify, d: { token: 'pass' } })
                break;

            case OpCode.InvalidSession: {
                clearInterval(this.heartbeatInterval);
                this.state = State.DESTROYED;
                if (payload.d && payload.d.code == 401) {
                    console.error('Token provided is invalid.');
                }
                else {
                    console.error('Error critical: ' + payload.d);
                }
                break;
            }

            case OpCode.Dispatch: {
                if (payload.t == Events.READY) {
                    this.state = State.CONNECTED;
                    this.debug('CORE', 'Ready')
                }
                // Handler
            }
        }
    }

    private send(data: IPayload) {
        this.debug('CORE', 'Output', data);
        this.ws.send(payloadToJson(data));
    }

    public debug(namespace: string, message: string, ...args: any) {
        if (this.options.debug)
            console.log(`[${new Date().toLocaleTimeString()}] [DEBUG] [${namespace.toUpperCase()}] : ${message} | `, ...args)
    }
}
new ZuraaaJs({
    secure: false,
    url: '127.0.0.1',
    port: 80,
    debug: true,
})