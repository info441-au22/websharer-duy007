import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post("/", async (req, res, next) => {
    let postObj = req.body;
    try {
        let newPost = new req.models.Post({
            url: postObj.url,
            username: postObj.username,
            description: postObj.description,
            created_date: Date.now()
        });
        await newPost.save();
        res.json({ "status": "success" });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ "status": "error", "error": error.message });
    }
});

router.get("/", async (req, res, next) => {
    try {
        let allPost = await req.models.Post.find();
        const resPost = await Promise.all (allPost.map(async post => {
            let htmlPreview = {}
            try {
                htmlPreview = await getURLPreview(post.url);
            } catch (error) {
                htmlPreview = error.message;
            }
            return { "description": post.description, "username": post.username, "htmlPreview": htmlPreview };
        }));
        res.json(resPost);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ "status": "error", "error": error.message });
    }
});
export default router;
