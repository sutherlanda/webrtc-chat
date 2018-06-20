import { EventEmitter } from "events";
import { ClientConnection } from "./ClientConnection";
import { Connection } from "./Connection";
import { HostConnection } from "./HostConnection";

class ConnectionManager {
  private emitter: EventEmitter = new EventEmitter();
  private connection: Connection;

  isConnected(): boolean {
    return this.connection !== null;
  }

  sendMessage(message: string): void {
    this.connection.send(message);
  }

  onMessage(callback: (msg: string) => any): void {
    this.emitter.on("message", callback);
  }

  onStatusChange(callback: () => any): void {
    this.emitter.on("status", callback);
  }

  offMessage(callback: (msg: string) => any): void {
    this.emitter.off("message", callback);
  }

  offStatusChange(callback: () => any): void {
    this.emitter.off("status", callback);
  }

  host = (): void => {
    this.setupConnection(new HostConnection());
  }

  join = (): void => {
    this.setupConnection(new ClientConnection());
  }

  private setupConnection = (conn: Connection): void => {
    conn.onReady(() => {
      this.connection = conn;
      this.emitter.emit("status");
    });

    conn.onMessage((msg: string) => {
      this.emitter.emit("message", msg);
    });
  }
}

export default ConnectionManager;
