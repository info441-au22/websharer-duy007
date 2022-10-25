import express from 'express';
var router = express.Router();

import postsRouter from './controllers/posts.js';
import urlsRouter from './controllers/urls.js';

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.use('/posts', postsRouter);
router.use('/urls', urlsRouter);

export default router;