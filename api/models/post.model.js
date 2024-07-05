import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
    {
        author: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            default: 'https://blog.devziaus.xyz/images/welcome.webp',
        },
        category: {
            type: String,
            default: 'Uncategorized',
        },
        tags: {
            type:[String],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        }
    }, { timestamps: true}
);

const Post = mongoose.model('Post', postSchema);

export default Post;