import { EventEmitter } from "events";
import * as SimplePeer from "simple-peer";
import { Connection } from "./Connection";

export class HostConnection implements Connection {
  private emitter: EventEmitter;
  private wss: WebSocket;
  private peers: SimplePeer.Instance[];

  constructor() {
    this.emitter = new EventEmitter();
    this.wss = new WebSocket("ws://localhost:3210");
    this.wss.onclose = () => {
      console.log("Socket closed");
    };

    this.wss.onerror = (err: ErrorEvent) => {
      console.log("Socket error");
      console.log(err);
    };

    this.wss.onopen = () => {
      console.log("Connected");
    };

    // On receiving data over the socket,
    // create a new RTC connection and initiate signaling
    this.wss.onmessage = (message: MessageEvent) => {
      // Create a new rtc peer, and return the signal
      const rtc = new SimplePeer({ initiator: false, trickle: false });
      rtc.signal(message.data);

      // On receipt of a signal from rtc peer,
      // send data back to client over socket
      rtc.on("signal", (data: string) => {
        // ws.send(data);
        this.wss.send(data);
      });

      // On connect, our connection is established
      // so add this peer to the list of peers
      rtc.on("connect", () => {
        this.peers.push(rtc);
      });

      // On receipt of data from rtc,
      // broadcast to all other peers
      rtc.on("data", (msg: string) => {
        this.emitter.emit("message", msg);

        // broadcast message to all peers
        this.peers.forEach((peer: SimplePeer.Instance) => {
          // don't send to ourself
          if (peer === rtc) {
            return;
          }

          peer.send(msg);
        });
      });
    };
  }

  onReady(callback: () => any): void {
    callback();
  }

  send(message: string): void {
    this.peers.forEach(peer => {
      peer.send(message);
    });
  }

  onMessage(callback: (msg: string) => any): void {
    this.emitter.on("message", callback);
  }
}
