const express = require('express')
const router = express.Router()
const db = require('../db')
const upload = require('../multer')


//get all replies for a thread
router.get('/:threadId', async (req, res, next) => {
    const result = db.getReplies(req.params.threadId)
    return res.send(result)
})

//add new reply to the thread
router.post('/:threadId', upload.single('file'), async(req, res, next) => {
    const body = {
        threadId : req.params.threadId,
        content : req.body.content,
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