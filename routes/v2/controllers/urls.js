
import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.get("/preview", async (req, res, next) => {
    let htmlPreview = {}
    try {
         htmlPreview = await getURLPreview(req.query.url);
    } catch (error) {
        htmlPreview = error.message;
    }
    res.type('txt');
    res.send(htmlPreview);
});
export default router;

