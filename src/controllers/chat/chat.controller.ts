import { io } from "../../app";
import { IMessage, IRoom } from "../../interfaces/chat";
import { Messages } from "../../schema/messageSchema";
import { Rooms } from "../../schema/roomSchema";
import { Users } from "../../schema/userSchema";

const chatController = async (socket: any) => {
  socket.on("getOrCreateUser", async (user: any) => {
    let userFound = await Users.findOne({ codeUnique: user.email });
    if (!userFound) {
      userFound = await Users.create({
        name: user.first_name,
        codeUnique: user.email,
      });
    }

    socket.emit("user", userFound);
  });

  socket.on("selectRoom", async (data: IRoom) => {
    const rooms = await Rooms.find({}).populate("messages");

    const findRoom = rooms.find(
      (room: IRoom) =>
        (room.userA === data.userA && room.userB === data.userB) ||
        (room.userA === data.userB && room.userB === data.userA)
    );

    if (findRoom) {
      socket.emit("room", findRoom);
      socket.join(findRoom.id);
    } else {
      const { userA, userB } = data;

      const room = await Rooms.create({ userA, userB });
      socket.join(room.id);
      socket.emit("room", room);
    }
  });

  socket.on("rooms", async (userID: string) => {
    const rooms = await Rooms.find({}).populate("messages");
    const filterRooms = rooms.filter(
      (room: IRoom) => room.userA === userID || room.userB === userID
    );

    socket.emit("rooms", filterRooms);
  });

  socket.on("message", async (message: IMessage) => {
    const { text, roomId, user } = message;

    const room = await Rooms.findById(roomId);

    const newMessage = await Messages.create({
      text,
      roomId,
      user,
    });

    room?.messages?.push(newMessage);
    await room?.save();

    const atRoom = await Rooms.findById(roomId).populate("messages");

    io.to(roomId).emit("message", atRoom?.messages);
  });

  socket.on("typing", (data: any) => {
    io.emit("typing", data);
  });
};

export default chatController;
