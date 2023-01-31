import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/chat";

const UsersSchema = new Schema({
  name: String,
  codeUnique: {
    type: String,
    required: true,
    unique: true
  },
});


const Users = mongoose.model<IUser>("Users", UsersSchema);

export {Users}