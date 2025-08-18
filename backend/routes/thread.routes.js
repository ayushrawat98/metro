const express = require('express')
const router = express.Router()
const db = require('../db')
const upload = require('../multer')
const thumbnail = require('../thumbnail')
const { ratelimit } = require('../ratelimit')
const map = {}

//get all replies for a thread
router.get('/:threadId', async (req, res, next) => {
    const result = db.getReplies(req.params.threadId)
    return res.send(result)
})

//add new reply to the thread
router.post('/:threadId', ratelimit(5000, map), upload.single('file'), thumbnail.thumbnail, thumbnail.compress, async(req, res, next) => {
    const body = {
        threadId : req.params.threadId,
        content : req.body.content,
		ogfilename : req.body.ogfilename,
        file : req.file ? req.file?.filename : "",
        mimetype : req.file ? req.file?.mimetype : "",
        replyto : req.body.replyto,
		boardname : req.body.boardname,
        createdat : new Date().toISOString()
    }
    const result = db.createReply(body)
    return res.send(result)
})

module.exports = router