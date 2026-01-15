import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
