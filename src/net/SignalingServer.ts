import { Server as WebSocketServer } from 'ws';

let server = new WebSocketServer({ port: 3210 });
server.on('connection', (socket) => {
    server.on('message', (msg) => {
        server.clients.forEach((other) => {
            if (other === socket) {
                return;
            }

            other.send(msg);
        })
    });
});
