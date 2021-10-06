import mongoose from "mongoose";
import MessageSchema from "../messages/schema.js";

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chatHistory: { type: [MessageSchema], required: true },
});

export default mongoose.model("rooms", RoomSchema);
