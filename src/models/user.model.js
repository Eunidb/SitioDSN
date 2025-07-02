import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
    type: String,
    enum: ['admin', 'maestro1', 'maestro2', 'maestro3'],
    default: 'maestro1',
  },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);