const express = require('express')
const router = express.Router()
const db = require('../db')
const upload = require('../multer')
const thumbnail = require('../thumbnail')
const { ratelimit } = require('../ratelimit')
const uniqueName = require('../unique')
const path = require("path")
const fs = require('fs')
const { banUser } = require('../ban')
const map = {}

//get all replies for a thread
router.get('/:threadId', async (req, res, next) => {
    const result = db.getReplies(req.params.threadId)
    return res.send(result)
})

router.delete('/:threadId', async(req, res, next) => {
	if(req.query.key != 'lele'){
		return res.send("false")
	}
	const threadclone = db.getThread(req.params.threadId)
	if(threadclone.file.trim().length > 0){
		const deletefile = path.join(__dirname,'..', 'data', 'files', threadclone.file)
		fs.unlinkSync(deletefile)
		const deletethumbnail = path.join(__dirname,'..', 'data', 'files', 't-'+threadclone.file)
		fs.unlinkSync(deletethumbnail)
	}
    const result = db.deleteThread(req.params.threadId)
    return res.send(result)
})

//add new reply to the thread
router.post('/:threadId', ratelimit(10000, map), uniqueName.uniqueName, banUser, upload.single('file'), thumbnail.thumbnail, thumbnail.compress, async(req, res, next) => {
	if(req.body.content.trim().length == 0){
		return res.status(400).json("wrong request")
	}
	if(req.body.content == 'delete?key=lele'){
		let result = deletePost(req.body.replyto, undefined)
		return res.send(result)
	}else if(req.body.content == 'ban?key=lele'){
		let result = banUserMethod(req.body.replyto)
		return res.send(result)
	}
    const body = {
        threadId : req.params.threadId,
        content : req.body.content,
		ogfilename : req.body.ogfilename,
        file : req.file ? req.file?.filename : "",
        mimetype : req.file ? req.file?.mimetype : "",
        replyto : req.body.replyto,
		boardname : req.body.boardname,
        createdat : new Date().toISOString(),
		username : req.uniqueName
    }
    const result = db.createReply(body)
    return res.send(result)
})

function banUserMethod(postid){
	const threadclone = db.getThread(postid)
	db.banUsername(threadclone.username)
	return deletePost(postid, threadclone)
}

function deletePost(postid, threadcopy){
	const threadclone = threadcopy ?? db.getThread(postid)
	if(threadclone.file.trim().length > 0){
		const deletefile = path.join(__dirname,'..', 'data', 'files', threadclone.file)
		fs.unlink(deletefile,()=>{})
		const deletethumbnail = path.join(__dirname,'..', 'data', 'files', 't-'+threadclone.file)
		fs.unlink(deletethumbnail,()=>{})
	}
    const result = db.deleteThread(postid)
    return result
}

module.exports = router