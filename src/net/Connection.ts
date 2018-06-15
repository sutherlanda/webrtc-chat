export interface Connection {
  onReady(callback: () => any): void;
  send(message: string): void;
  onMessage(callback: (msg: string) => any): void;
}
