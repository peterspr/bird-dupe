import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        bio: {
            type: String,
            default: "",
        },
        interests: {
            type: String,
            default: "",
        },
        savedPosts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Post",
                default: [],
            },
        ],
    }
);

userSchema.index({ name: "text" });
const UserModel = mongoose.model('User', userSchema);
export default UserModel;