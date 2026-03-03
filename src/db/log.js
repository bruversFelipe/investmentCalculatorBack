import { Schema, model } from 'mongoose';

const logSchema = new Schema(
  {
    message: { type: String, default: '' },
  },
  { timestamps: true },
);

export default model('logs', logSchema);
