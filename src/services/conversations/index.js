import express from "express";
import ConvoModel from "./schema.js";

const convoRouter = express.Router();

convoRouter.post("/", async (req, resp, next) => {
  const newConvo = new ConvoModel({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConvo = await newConvo.save();
    resp.status(200).send(savedConvo);
  } catch (err) {
    next(err);
  }
});

export default convoRouter;
