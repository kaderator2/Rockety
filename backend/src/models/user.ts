// models/user.ts
import mongoose, { Document, Schema } from 'mongoose';
import { ReplayFile } from './replayFile';

export interface IUser extends Document {
    email: string;
    password: string;
    resetToken?: string;
    profilePicture: string;
    replays: ReplayFile[];
    team: string;
    // Add more fields as needed for esports statistics
}

const userSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    profilePicture: { type: String },
    replays: [{ type: Object }],
    team: { type: String },
    // Add more fields as needed for esports statistics
});

export default mongoose.model<IUser>('User', userSchema);
