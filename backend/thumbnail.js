
const fs = require("fs")
const sharp = require("sharp")
const path = require("path")
const ffmpeg = require('fluent-ffmpeg');



exports.thumbnail = async (req, res, next) => {
	if(req.file == undefined || req.file == null){
		return next()
	}
	let ogfilePath = path.join(__dirname, 'data', 'files', req.file.filename)
	let thumbfilePath = path.join(__dirname, 'data', 'files', 't-' + req.file.filename)

	if (req.file.mimetype == 'image/gif') {
		sharp(ogfilePath)
			.resize(100, 100, { fit: "cover", position: "center" })
			.webp({ quality: 100 })
			.toFile(thumbfilePath)
			.then(() => next())
			.catch((err) => next(err))
	} else if (req.file.mimetype.startsWith('video')) {
		ffmpeg(ogfilePath)
			.frames(1)
			.outputOptions(["-vf", "thumbnail,scale=100:100:force_original_aspect_ratio=increase,crop=100:100"])
			.size("100x100")
			.format("image2")   
			.save(thumbfilePath)
			.on("end", () => {
				next();
			})
			.on("error", (err) => {
				next(err);
			});
	} else {
		let temp = ogfilePath + '.temp'
		sharp(ogfilePath).resize(100, 100, { fit: "cover", position: "center" }).webp({ quality: 100 }).toFile(thumbfilePath).then(() => next())
	}
}

exports.compress = async (req, res, next) => {
	if(req.file == undefined || req.file == null){
		return next()
	}
	if((req.file.mimetype.startsWith('video')) || req.file.mimetype == 'image/gif'){
		return next()
	}
	let ogfilePath = path.join(__dirname, 'data', 'files', req.file.filename)
	let temp = ogfilePath + '.temp'
	sharp(ogfilePath).webp({ quality: 80 }).toFile(temp).then(x => fs.rename(temp, ogfilePath, (err) => { if(err) {return next(err)}  return next()})).catch(err => next(err))
}

