import mongoose from "mongoose";

export default function connectDB() {
  mongoose.connect("mongodb://127.0.0.1:27017/SchoolDB")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));
}
