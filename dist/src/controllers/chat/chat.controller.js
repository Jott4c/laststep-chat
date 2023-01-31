"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../../app");
const messageSchema_1 = require("../../schema/messageSchema");
const roomSchema_1 = require("../../schema/roomSchema");
const userSchema_1 = require("../../schema/userSchema");
const chatController = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on("getOrCreateUser", (user) => __awaiter(void 0, void 0, void 0, function* () {
        let userFound = yield userSchema_1.Users.findOne({ codeUnique: user.email });
        if (!userFound) {
            userFound = yield userSchema_1.Users.create({
                name: user.first_name,
                codeUnique: user.email,
            });
        }
        socket.emit("user", userFound);
    }));
    socket.on("selectRoom", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const rooms = yield roomSchema_1.Rooms.find({}).populate("messages");
        const findRoom = rooms.find((room) => (room.userA === data.userA && room.userB === data.userB) ||
            (room.userA === data.userB && room.userB === data.userA));
        if (findRoom) {
            socket.emit("room", findRoom);
            socket.join(findRoom.id);
        }
        else {
            const { userA, userB } = data;
            const room = yield roomSchema_1.Rooms.create({ userA, userB });
            socket.join(room.id);
            socket.emit("room", room);
        }
    }));
    socket.on("rooms", (userID) => __awaiter(void 0, void 0, void 0, function* () {
        const rooms = yield roomSchema_1.Rooms.find({}).populate("messages");
        const filterRooms = rooms.filter((room) => room.userA === userID || room.userB === userID);
        socket.emit("rooms", filterRooms);
    }));
    socket.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { text, roomId, user } = message;
        const room = yield roomSchema_1.Rooms.findById(roomId);
        const newMessage = yield messageSchema_1.Messages.create({
            text,
            roomId,
            user,
        });
        (_a = room === null || room === void 0 ? void 0 : room.messages) === null || _a === void 0 ? void 0 : _a.push(newMessage);
        yield (room === null || room === void 0 ? void 0 : room.save());
        const atRoom = yield roomSchema_1.Rooms.findById(roomId).populate("messages");
        app_1.io.to(roomId).emit("message", atRoom === null || atRoom === void 0 ? void 0 : atRoom.messages);
    }));
    socket.on("typing", (data) => {
        app_1.io.emit("typing", data);
    });
});
exports.default = chatController;
