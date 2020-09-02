import { Client as DiscordClient, Guild } from 'discord.js';
import Websocket from 'ws';
import { parsePayload, OpCode, IPayload, payloadToJson, Event } from './util/Payload';
import { EventEmitter } from 'events';
import PacketHandler from './handlers/Index';
import { Endpoints } from './util/Endpoints';
import Cache from './util/Cache';
import axios from 'axios';

export interface IOptions {
    secure: boolean | true;
    url: string;
    port: number | 80;
    debug: boolean | false;
    token: string;
}

export enum State {
    CONNECTING,
    CONNECTED,
    DISCONNECTED,
    DESTROYED
}

export default class Client extends EventEmitter {
    private ws: Websocket;
    private heartbeatInterval?: any;
    private state: State = State.CONNECTING;
    public readonly token: string = this.options.token;
    private handler: PacketHandler = new PacketHandler(this);
    public readonly endpoints: Endpoints = new Endpoints(this.options.secure, this.options.url, this.options.port);
    public readonly cache: Cache = new Cache(this);
    constructor(public readonly options: IOptions, public readonly client: DiscordClient) {
        super();
        this.client.on('guildCreate', () => this.update());
        this.client.on('guildDelete', () => this.update());

        this.ws = new Websocket(`${options.secure ? 'wss' : 'ws'}://${options.url}:${options.port}`);
        this.ws.onopen = (event: Websocket.OpenEvent) => this.onOpen(event);
        this.ws.onclose = (event: Websocket.CloseEvent) => this.onClose(event);
        this.ws.onerror = (event: Websocket.ErrorEvent) => this.onError(event);
        this.ws.onmessage = (event: Websocket.MessageEvent) => this.onMessage(event);
    }

    private async update() {
        let retry = 5;
        do {
            try {
                const req = await axios.patch(this.endpoints.bots.id(this.client.user!.id), {
                    token: this.token,
                    data: {
                        guilds: this.client.guilds.cache.size
                    }
                });

                if (req.status == 204)
                    return;
            } catch (e) { }
        }
        while (retry >= 0);
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

                this.send({ op: OpCode.Identify, d: { token: this.token } })
                break;

            case OpCode.InvalidSession: {
                clearInterval(this.heartbeatInterval);
                this.state = State.DESTROYED;
                if (payload.d && payload.d.code == 401) {
                    throw new Error('Token provided is invalid.');
                }
                else {
                    throw new Error('Error critical: ' + payload.d);
                }
                break;
            }

            case OpCode.Dispatch: {
                if (payload.t == Event.READY) {
                    this.state = State.CONNECTED;

                    await this.cache.init(payload.d.users, payload.d.bots);

                    this.debug('CORE', 'Ready');
                    this.emit('ready');
                }
                this.handler.handlePacket(payload);
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