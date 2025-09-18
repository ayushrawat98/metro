const db = require('./db')
const path = require("path")
const fs = require('fs')

exports.editOrDelete = async function checkForEditOrDelete(req, res, next){
	//for admin
	if(req.body.content.trim() == 'delete?key=lele'){
		let result = deletePost(req.body.replyto, undefined)
		return res.send(result)
	}else if(req.body.content.trim() == 'ban?key=lele'){
		let result = banUserMethod(req.body.replyto)
		return res.send(result)
	}

	//for users
	if(req.body.content.trim() == '@delete@'){
		let result = deletePostByUser(req.body.replyto, req.uniqueName)
		return res.send(result)
	}else if(req.body.content.trim().startsWith('@edit@')){
		let result = editPostByUser(req.body.content, req.body.replyto, req.uniqueName)
		return res.send(result)
	}

	next()
}

function deletePostByUser(replyto, username){
	const threadclone = db.getThread(replyto)
	console.log(threadclone.username, username)
	if(threadclone.threadid == null){
		throw new Error("Cannot delete parent")
	}else if(threadclone.username != username){
		throw new Error("Delete not allowed")
	}else{
		return deletePost(replyto, threadclone)
	}
}

function editPostByUser(newContent, replyto, username){
	const threadclone = db.getThread(replyto)
	if(threadclone.username != username){
		throw new Error("Edit not allowed")
	}
	const updatedContent = threadclone.content + '\nEdit : ' + newContent.split("@edit@")[1].trim()
	return db.editPost(updatedContent, replyto)
}


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