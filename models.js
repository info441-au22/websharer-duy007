import mongoose from 'mongoose';

let models = {};
main();
async function main() {
    console.log("Connect to mongoDB");
    await mongoose.connect("mongodb+srv://info441:info441@cluster0.nbsx4fd.mongodb.net/websharer?retryWrites=true&w=majority");
    const postSchema = new mongoose.Schema({
        url: String,
        username: String,
        description: String,
        likes: [String],
        created_date: Date
    });
    models.Post = mongoose.model('Post', postSchema);
    console.log("Post Model created");
    const commentSchema = new mongoose.Schema({
        username: String,
        comment: String,
        post: {type: mongoose.Schema.Types.ObjectId, ref: "Post"},
        created_date: Date
    });
    models.Comment = mongoose.model('Comment', commentSchema);
    console.log("Comment Model created");
}

export default models;