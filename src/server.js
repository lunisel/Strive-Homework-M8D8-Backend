import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const port = process.env.PORT;
const mongoConnection = process.env.MONGO_CONNECTION_STRING;

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, { allowEIO3: true });

io.on("connection", (socket) => {
  console.log(socket.id);
});

httpServer.listen(port, () => {
  console.log("Server in running on port", port);
});
