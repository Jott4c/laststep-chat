import mongoose from "mongoose";
import "dotenv/config";

mongoose.Promise = global.Promise;

mongoose.connect(String(process.env.MONGODB))
.then(() => console.log("conectado ao mongodb"))
.catch((err) => console.log(err))