import * as SimplePeer from 'simple-peer';
import * as SimpleWebSocket from 'simple-websocket';
import { EventEmitter } from 'events';

export class HostConnection {

    peers: SimplePeer.Instance[];
    emitter: EventEmitter;
    socket: SimpleWebSocket;

    constructor() {
        this.emitter = new EventEmitter();
        this.socket = new SimpleWebSocket('ws://localhost:3210');
        this.socket.on('close', () => { console.log('Socket closed'); });
        this.socket.on('error', (err) => { console.log('Socket error'); console.log(err); });
        this.socket.on('connect', () => { console.log('Connected'); });

        // On receiving data over the socket, create a new RTC connection and initiate signaling
        this.socket.on('data', (data: string) => {

            // Create a new rtc peer, and return the signal
            let rtc = new SimplePeer({ initiator: false, trickle: false });
            rtc.signal(data);

            // On receipt of a signal from rtc peer, send data back to client over socket
            rtc.on('signal', (data: string) => {
                this.socket.send(data);
            });

            // On connect, our connection is established so add this peer to the list of peers
            rtc.on('connect', () => {
                this.peers.push(rtc);
            });

            // On receipt of data from rtc, broadcast to all other peers
            rtc.on('data', (msg: string) => {
                this.emitter.emit('message', msg);

                // broadcast message to all peers
                this.peers.forEach((peer: SimplePeer.Instance) => {

                    // don't send to ourself
                    if (peer === rtc) {
                        return;
                    }

                    peer.send(msg);
                });
            });
        });
    }

    onReady = (callback: () => any) => {
        callback();
    }

    send = (message: string) => {
        this.peers.forEach((peer) => {
            peer.send(message);
        });
    }

    onMessage = (callback: () => any) => {
        this.emitter.on('message', callback);
    }
}
