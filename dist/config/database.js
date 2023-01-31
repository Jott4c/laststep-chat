"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.connect(String(process.env.MONGODB))
    .then(() => console.log("conectado ao mongodb"))
    .catch((err) => console.log(err));
