const express = require('express')
const router = express.Router()
const db = require('../db')
const upload = require('../multer')
const thumbnail = require('../thumbnail')
const { ratelimit } = require('../ratelimit')
const uniqueName = require('../unique')
const farmHash = require('farmhash')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const { banUser } = require('../ban')
const map = {}

//return all threads in this board
router.get('/:boardName', async(req, res, next) => {
    const result = db.getThreads(req.params.boardName)
    return res.send(result)
})

//create new thread in current board
router.post('/:boardName', ratelimit(30000, map), uniqueName.uniqueName, banUser, upload.single('file'), thumbnail.thumbnail, thumbnail.compress, async(req, res, next) => {
	if(req.body.content.trim().length == 0){
		return res.status(400).json("wrong request")
	}
    if(!req.file){
        return res.status(400).send("image is required")
    }
	if(!['b','g', 'out','media','meta'].includes(req.params.boardName)){
		return res.status(400).send("board does not exist")
	}
    const body = {
        boardName : req.params.boardName,
        content : req.body.content,
		ogfilename : req.body.ogfilename,
        file : req.file.filename,
        mimetype : req.file.mimetype,
        createdat : new Date().toISOString(),
		username : req.uniqueName
    }
    const result = db.createThread(body)
	//set the username or hash for current thread
	// let newusername = farmHash.hash32WithSeed(req.realIp, Number(result.lastInsertRowid)).toFixed(0)
	// db.updateUsername(newusername, result.lastInsertRowid)
	// const newusername = uniqueNamesGenerator({
	// 	dictionaries: [colors, adjectives, animals], // colors can be omitted here as not used
	// 	seed: req.realIp + result.lastInsertRowid
	// });
	// db.updateUsername(newusername, result.lastInsertRowid)
    return res.send(result)
})

module.exports = router