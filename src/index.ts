import {SocketServer} from "./socketServer";

async function main() {
  new SocketServer(8383, 5000);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
})