import express from 'express';
var router = express.Router();

router.post("/", async (req, res, next ) => {
    if (req.session.isAuthenticated) {
        let infoObj = req.body;
        try {
            await req.models.UserInfo.exists({username: infoObj.username}, async (error, doc) => {
                if (error) {
                    res.status(500).json({ "status": "error", "error": error.message });
                } else {
                    if (!doc) {
                        let newUserInfo = new req.models.UserInfo({
                            username: infoObj.username,
                            favorite_website: infoObj.userInfo,
                            created_date: Date.now()
                        });
                        await newUserInfo.save();
                    } else {
                        const filter = {username: infoObj.username}
                        const update = {favorite_website: infoObj.userInfo, created_date: Date.now()}
                        await req.models.UserInfo.findOneAndUpdate(filter, update,  {new: false})
                    }
                }
            })
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
})

router.get("/", async (req, res) => {
    let username = req.query.username
    if (req.session.isAuthenticated) {
        try {
            await req.models.UserInfo.exists({username: username}, async (error, doc) => {
                if (error) {
                    res.status(500).json({ "status": "error", "error": error.message });
                } else {
                    if (doc) {
                        const filter = {username: username}
                        let userInfo = await req.models.UserInfo.findOne(filter)
                        res.json(userInfo)
                    } else {
                        res.json({userInfo: "N/A", created_date: "N/A"})
                    }
                }
            })
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

export default router;