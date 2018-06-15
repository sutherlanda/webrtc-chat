import { EventEmitter } from "events";
import * as SimplePeer from "simple-peer";
import { Connection } from "./Connection";

export class ClientConnection implements Connection {
  private socket: WebSocket;
  private emitter: EventEmitter;
  private rtc: SimplePeer.Instance;

  constructor() {
    this.emitter = new EventEmitter();
    this.socket = new WebSocket("ws://localhost:3210");

    this.socket.onclose = () => {
      console.log("Socket closed");
    };

    this.socket.onerror = (err: Event) => {
      console.log("Socket error");
      console.log(err);
    };

    this.socket.onopen = () => {
      // this.socket.on('connect', () => {
      this.rtc = new SimplePeer({ initiator: true, trickle: false });
      this.rtc.on("signal", (data: string) => {
        this.socket.send(data);
      });

      this.socket.onmessage = (msg: MessageEvent) => {
        // this.socket.on('data', (data: string) => {
        this.rtc.signal(msg.data);
      };

      this.rtc.on("connect", () => {
        this.emitter.emit("connected");
        // safe to destroy signaler
        this.socket.close();
      });

      this.rtc.on("data", (msg: string) => {
        this.emitter.emit("message", msg);
      });
    };
  }

  onReady(callback: () => any): void {
    this.emitter.on("connected", callback);
  }

  send(message: string): void {
    this.rtc.send(message);
  }

  onMessage(callback: (msg: string) => any): void {
    this.emitter.on("message", callback);
  }
}
