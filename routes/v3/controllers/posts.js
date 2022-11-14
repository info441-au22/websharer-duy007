import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post("/", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        let postObj = req.body;
        try {
            let newPost = new req.models.Post({
                url: postObj.url,
                username: req.session.account.username,
                description: postObj.description,
                created_date: Date.now()
            });
            await newPost.save();
            res.json({ "status": "success" });
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ "status": "error", "error": error.message });
        }
    } else {
        res.status(401)
        res.json({
            status: "error",
            error: "not logged in"
         })
    }
});

router.post("/like", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            let ref_post = await req.models.Post.findById(req.body.postID);
            if (!ref_post.likes.includes(req.session.account.username)) {
                ref_post.likes.push(req.session.account.username)
            }
            await ref_post.save()
            res.json( {"status": "success"})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ "status": "error", "error": error.message });        
        }
    } else {
        res.status(401)
        res.json({
            status: "error",
            error: "not logged in"
         })
    }
})

router.post("/unlike", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            let ref_post = await req.models.Post.findById(req.body.postID);
            if (ref_post.likes.includes(req.session.account.username)) {
                ref_post.likes.pull(req.session.account.username)
            }
            await ref_post.save()
            res.json( {"status": "success"})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ "status": "error", "error": error.message });        
        }
    } else {
        res.status(401)
        res.json({
            status: "error",
            error: "not logged in"
         })
    }
})

router.delete("/", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            let ref_post = await req.models.Post.findById(req.body.postID);
            if (ref_post.username !== req.session.account.username) {
                res.status(401).json({
                    status: 'error',
                    error: "you can only delete your own posts"
                 })
            } else {
                await req.models.Comment.deleteMany({post: req.body.postID})
                await req.models.Post.deleteOne({_id: req.body.postID})   
            }
            res.json( {"status": "success"})
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ "status": "error", "error": error.message });        
        }
    } else {
        res.status(401)
        res.json({
            status: "error",
            error: "not logged in"
         })
    }
})

router.get("/", async (req, res, next) => {
    let username = req.query.username
    try {
        let allPost = []
        if (username) {
            allPost = await req.models.Post.find({username: username});
        } else {
            allPost = await req.models.Post.find();
        }
        const resPost = await Promise.all (allPost.map(async post => {
            let htmlPreview = {}
            try {
                htmlPreview = await getURLPreview(post.url);
            } catch (error) {
                htmlPreview = error.message;
            }
            return {"id":post._id, "likes":post.likes, "created_date": post.created_date,  "description": post.description, "username": post.username, "htmlPreview": htmlPreview };
        }));
        res.json(resPost);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ "status": "error", "error": error.message });
    }
});
export default router;
