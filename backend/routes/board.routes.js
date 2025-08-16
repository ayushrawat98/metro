const express = require('express')
const router = express.Router()
const db = require('../db')
const upload = require('../multer')
const thumbnail = require('../thumbnail')

//return all threads in this board
router.get('/:boardName', async(req, res, next) => {
    const result = db.getThreads(req.params.boardName)
    return res.send(result)
})

//create new thread in current board
router.post('/:boardName', upload.single('file'), thumbnail.thumbnail, thumbnail.compress, async(req, res, next) => {
    if(!req.file){
        return res.status(500).send("Image is required")
    }
    const body = {
        boardName : req.params.boardName,
        content : req.body.content,
		ogfilename : req.body.ogfilename,
        file : req.file.filename,
        mimetype : req.file.mimetype,
        createdat : new Date().toISOString()
    }
    const result = db.createThread(body)
    return res.send(result)
})

module.exports = router