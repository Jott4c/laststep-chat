import {Document} from "mongoose"

export interface IRoom  extends Document {
   userA: string
   userB: string
   messages?: IMessage[]
}  

export interface IMessage extends Document {
    text: string
    user: string
    roomId: string
    createDate: Date
}

export interface IUser extends Document {
    name: string
    codeUnique: string
}