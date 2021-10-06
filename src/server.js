import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import { createServer } from "http";
import { Server } from "socket.io";
import RoomModel from "./services/rooms/schema.js";
import convoRouter from "./services/conversations/index.js";

const port = process.env.PORT;
const mongoConnection = process.env.MONGO_CONNECTION_STRING;

let onlineUsers = [];

const app = express();

app.use(cors());
app.use(express.json());

app.get("/online-users", (req, res) => {
  res.status(200).send({ onlineUsers });
});

app.get("/rooms/:name", async (req, res) => {
  const room = await RoomModel.findOne({ room: req.params.name });

  res.send(room.chatHistory);
});

const httpServer = createServer(app);

app.use("convo", convoRouter);

const io = new Server(httpServer, { allowEIO3: true });

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("setUsername", ({ username, room }) => {
    console.log(username);
    socket.join(room);
    console.log(socket.rooms);

    onlineUsers.push({ username, id: socket.id, room });
    socket.emit("loggedin");
    socket.broadcast.emit("newConnection");
  });
});

io.on("sendmessage", async ({ message, room }) => {
  await RoomModel.findOneAndUpdate(
    { room },
    {
      $push: { chatHistory: message },
    }
  );
  socket.to(room).emit("message", message);
});

io.on("disconnect", () => {
  onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
  socket.broadcast.emit("newConnection");
});
console.table(listEndpoints(app));

mongoose.connect(mongoConnection, { useNewUrlParser: true }).then(() => {
  httpServer.listen(port, () => {
    console.log("Server listening on port", port);
  });
});
