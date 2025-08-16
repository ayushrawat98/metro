const multer = require('multer')
const fs = require("fs")
const sharp = require("sharp")
const path = require("path")
const stream = require('stream')
const ffmpeg = require('fluent-ffmpeg');

// ffmpeg.setFfmpegPath('C:\\Users\\aayus\\Downloads\\ffmpeg-master-latest-win64-gpl\\bin\\ffmpeg.exe')

const filefilter = (req, file, cb) => {
	let allowed = ['video/mp4', 'video/webm', 'image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']
	if (allowed.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb({ message: 'Unsupported File Format' }, false)
	}	
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'data/files')
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, uniqueSuffix)
	}
})

let newStorage = {
	_handleFile(req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		let ogfilePath = path.join(__dirname, 'data', 'files', uniqueSuffix + "-" + file.originalname)
		let thumbfilePath = path.join(__dirname, 'data', 'files', 't-' + uniqueSuffix + "-" + file.originalname)

		const ogStream = new stream.PassThrough();
		const thumbStream = new stream.PassThrough();

		file.stream.pipe(ogStream);
		file.stream.pipe(thumbStream);

		if (file.mimetype == 'image/gif') {
			const ogPromise = new Promise((resolve, reject) => {
				ogStream
					.pipe(fs.createWriteStream(ogfilePath))
					.on("finish", resolve)
					.on("error", reject);
			});

			const thumbPromise = new Promise((resolve, reject) => {
				thumbStream
					.pipe(
						sharp()
							.resize(100, 100, { fit: "cover", position: "center" })
							.webp({ quality: 100 })
					)
					.pipe(fs.createWriteStream(thumbfilePath))
					.on("finish", resolve)
					.on("error", reject);
			});

			Promise.all([ogPromise, thumbPromise])
				.then(() => {
					cb(null, {
						mimetype: file.mimetype,
						filename: uniqueSuffix + "-" + file.originalname,
						ogpath: ogfilePath,
						thumbpath: thumbfilePath
					});
				})
				.catch((err) => cb(err, null));

		} else if (file.mimetype.startsWith('video')) {

			const ogPromise = new Promise((resolve, reject) => {

				ogStream
					.pipe(fs.createWriteStream(ogfilePath))
					.on("close", resolve)
					.on("error", reject);
			});

			const thumbPromise = ogPromise.then(() =>
				new Promise((resolve, reject) => {
					ffmpeg(ogfilePath)
						.on("end", resolve)
						.on("error", reject)
						.frames(1)
						.outputOptions(["-vf", "thumbnail"])
						.size("100x100")
						.save(thumbfilePath);
				})
			);

			Promise.all([ogPromise, thumbPromise])
				.then(() => {
					console.log("all promise")
					cb(null, {
						mimetype: file.mimetype,
						filename: uniqueSuffix + "-" + file.originalname,
						ogpath: ogfilePath,
						thumbpath: thumbfilePath
					});
				})
				.catch((err) => cb(err, null));


		} else {
			// Process original
			const ogPromise = new Promise((resolve, reject) => {
				ogStream
					.pipe(sharp().webp({ quality: 80 }))
					.pipe(fs.createWriteStream(ogfilePath))
					.on("finish", resolve)
					.on("error", reject);
			});

			// Process thumbnail
			const thumbPromise = new Promise((resolve, reject) => {
				thumbStream
					.pipe(
						sharp()
							.resize(100, 100, { fit: "cover", position: "center" })
							.webp({ quality: 100 })
					)
					.pipe(fs.createWriteStream(thumbfilePath))
					.on("finish", resolve)
					.on("error", reject);
			});

			Promise.all([ogPromise, thumbPromise])
				.then(() => {
					cb(null, {
						mimetype: file.mimetype,
						filename: uniqueSuffix + "-" + file.originalname,
						ogpath: ogfilePath,
						thumbpath: thumbfilePath
					});
				})
				.catch((err) => cb(err, null));
		}
	},
	_removeFile(req, file, cb) {
		try {
			if (file.ogpath) fs.unlinkSync(file.ogpath);
			if (file.thumbpath) fs.unlinkSync(file.thumbpath);
			cb();
		} catch (err) {
			cb(err);
		}
	}
}

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: filefilter })
module.exports = upload