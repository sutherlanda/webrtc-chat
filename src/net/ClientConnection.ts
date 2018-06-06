import * as SimplePeer from 'simple-peer';
import * as SimpleWebSocket from 'simple-websocket';
import { EventEmitter } from 'events';

export class ClientConnection {

    socket: SimpleWebSocket;
    emitter: EventEmitter;
    rtc: SimplePeer.Instance;

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

    onReady = (callback: () => any) => {
        this.emitter.on('connected', callback);
    }

    send = (message: string) => {
        this.rtc.send(message);
    }

    onMessage = (callback: () => any) => {
        this.emitter.on('message', callback);
    }
}
