import {Dealer} from "zeromq";
import {SocketServer} from "./socketServer";

async function main() {
  new SocketServer(8383, 5000);

  const receiver = new Dealer();
  receiver.connect("tcp://127.0.0.1:5555");
  
  console.log("Proxy connected to zeromq server at port 5555");
  

  for await (const [msg] of receiver) {
    if (msg.length === 0) {
      receiver.close();
      console.log("received message from zeromq: <empty message>");
    } else {
      console.log(`received message from zeromq: ${msg}`);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
})