import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,

    },
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
        trim: true
    },
    links:{
        website:String,
        facebook:String,
        youtube:String,
        github:String
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'author', 'user'],
        default: 'user',
    },
},
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export default User;