const db = require('./db')

exports.banUser = async (req, res, next) => {
	let isBanned = db.checkBan(req.uniqueName)
	if(isBanned.length > 0){
		return res.status(403).json("We are full.")
	}else{
		return next()
	}
}