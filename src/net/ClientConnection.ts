import { IConnection } from './IConnection';
import * as SimplePeer from 'simple-peer';
import * as SimpleWebSocket from 'simple-websocket';
import { EventEmitter } from 'events';

export class ClientConnection implements IConnection {

    private socket: SimpleWebSocket;
    private emitter: EventEmitter;
    private rtc: SimplePeer.Instance;

    constructor() {
        this.emitter = new EventEmitter();
        this.socket = new SimpleWebSocket('ws://localhost:3210');

        this.socket.on('close', () => {
            console.log('Socket closed');
        });

        this.socket.on('error', (err) => {
            console.log('Socket error');
            console.log(err);
        });

        this.socket.on('connect', () => {
            this.rtc = new SimplePeer({ initiator: true, trickle: false });
            this.rtc.on('signal', (data: string) => {
                this.socket.send(data);
            });

            this.socket.on('data', (data: string) => {
                this.rtc.signal(data);
            });

            this.rtc.on('connect', () => {
                this.emitter.emit('connected');
                // safe to destroy signaler
                this.socket.destroy();
            });

            this.rtc.on('data', (msg: string) => {
                this.emitter.emit('message', msg);
            });
        });
    }

    public onReady(callback: () => any): void {
        this.emitter.on('connected', callback);
    }

    public send(message: string): void {
        this.rtc.send(message);
    }

    public onMessage(callback: (msg: string) => any): void {
        this.emitter.on('message', callback);
    }
}
