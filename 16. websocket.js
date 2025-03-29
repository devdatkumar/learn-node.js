import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

let clientId = 0;
wss.on("connection", (socket) => {
  clientId++;

  socket.send(`Hello number ${clientId}`);

  wss.clients.forEach((client) => {
    if (client !== socket && client.readyState === WebSocket.OPEN) {
      client.send(`client number ${clientId}`);
    }
  });
});

const client = new WebSocket("ws://localhost:3000");

client.on("message", (msg) => {
  console.log("Message from server:", msg.toString());
});

const client1 = new WebSocket("ws://localhost:3000");

client1.on("message", (msg) => {
  console.log("Message from server:", msg.toString());
});

const client2 = new WebSocket("ws://localhost:3000");

client2.on("message", (msg) => {
  console.log("Message from server:", msg.toString());
});
