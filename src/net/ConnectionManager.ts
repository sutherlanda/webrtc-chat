import { EventEmitter } from 'events';
import { IConnection } from './IConnection';
import { HostConnection } from './HostConnection';
import { ClientConnection } from './ClientConnection';

let connection: IConnection = null;
let emitter: EventEmitter = new EventEmitter();
let setupConnection = (conn: IConnection) => {
    conn.onReady(() => {
        connection = conn;
        emitter.emit('status');
    });

    conn.onMessage((msg: string) => {
        emitter.emit('message', msg);
    });
}

export class ConnectionManager {

    public isConnected(): boolean {
        return connection !== null;
    }

    public sendMessage(message: string): void {
        connection.send(message);
    }

    public onMessage(callback: (msg: string) => any): void {
        emitter.on('message', callback);
    }

    public onStatusChange(callback: () => any): void {
        emitter.on('status', callback);
    }

    public offMessage(callback: (msg: string) => any): void {
        emitter.off('message', callback);
    }

    public offStatusChange(callback: () => any): void {
        emitter.off('status', callback);
    }

    public host(): void {
        setupConnection(new HostConnection());
    }

    public join(): void {
        setupConnection(new ClientConnection());
    }
}
