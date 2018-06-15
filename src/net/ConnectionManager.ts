import { EventEmitter } from "events";
import { ClientConnection } from "./ClientConnection";
import { Connection } from "./Connection";
import { HostConnection } from "./HostConnection";

let connection: Connection;
const emitter: EventEmitter = new EventEmitter();
const setupConnection = (conn: Connection) => {
  conn.onReady(() => {
    connection = conn;
    emitter.emit("status");
  });

  conn.onMessage((msg: string) => {
    emitter.emit("message", msg);
  });
};

class ConnectionManager {
  isConnected(): boolean {
    return connection !== null;
  }

  sendMessage(message: string): void {
    connection.send(message);
  }

  onMessage(callback: (msg: string) => any): void {
    emitter.on("message", callback);
  }

  onStatusChange(callback: () => any): void {
    emitter.on("status", callback);
  }

  offMessage(callback: (msg: string) => any): void {
    emitter.off("message", callback);
  }

  offStatusChange(callback: () => any): void {
    emitter.off("status", callback);
  }

  host(): void {
    setupConnection(new HostConnection());
  }

  join(): void {
    setupConnection(new ClientConnection());
  }
}

export default ConnectionManager;
