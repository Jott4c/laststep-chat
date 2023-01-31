import mongoose, {Schema} from "mongoose";
import { IMessage, IRoom } from "../interfaces/chat";

const messagesSchema = new Schema({
    createDate: {
        type: Date,
        default: new Date()
    },
    text: String, 
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Rooms"
    },
    user: String
})


const Messages = mongoose.model<IMessage>("Messages", messagesSchema);

export {Messages}