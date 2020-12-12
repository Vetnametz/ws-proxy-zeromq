import { Server, Socket } from "socket.io";

import { Dealer } from "zeromq";

export class SocketServer {
  private receiver = new Dealer();
  private ioServer: Server;

  constructor(private port: number) {
    this.ioServer = new Server(port, {
      cors: {
        origin: `http://localhost:${port}`,
        methods: ["GET", "POST"]
      }
    });
    console.log('socket.io server start on port: ', this.port);

    this.ioServer.on('connection', this.onConnection.bind(this));
  }

  private async onConnection(socket: Socket) {
    console.log('CLIENT CONNECTED');
    this.receiver.connect("tcp://127.0.0.1:5555");
    console.log("Proxy connected to zeromq server at port 5555");

    for await (const [msg] of this.receiver) {
      if (msg.length === 0) {
        console.log("NO messages were received from zeromq server");
      } else {
        try {
          socket.emit('new parameters', JSON.parse(msg.toString()));
          console.log(`received message from zeromq: ${msg}`);
        } catch (error) {
          console.dir(error, { depth: null, colors: true });
        }
      }
    }

    socket.on("disconnect", (reason) => {
      console.log('--Disconnect reason--');
      console.dir(reason, { depth: null, colors: true });
    });

  }
}
