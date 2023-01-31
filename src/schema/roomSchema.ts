import mongoose, {Schema} from "mongoose";
import { IRoom } from "../interfaces/chat";

const roomsSchema = new Schema({
    userA: {
        type: String
    },
    userB: {
        type: String
    }, 
    messages: [{
        type: Schema.Types.ObjectId,
        ref:"Messages"
    }]
    })


    const Rooms = mongoose.model<IRoom>("Room", roomsSchema);

export {Rooms}