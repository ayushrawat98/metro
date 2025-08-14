const multer = require('multer')
const fs = require("fs")
const sharp = require("sharp")
const path = require("path")
const stream = require('stream')

const filefilter = (req, file, cb) => {
	// 'video/mp4', 'video/webm',
	let allowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
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
		cb(null, uniqueSuffix + "-" + file.originalname)
	}
})

let newStorage = {
	_handleFile(req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		let ogfilePath = path.join(__dirname, 'data', 'files', uniqueSuffix + file.originalname)
		let thumbfilePath = path.join(__dirname, 'data', 'files', 't-' + uniqueSuffix + file.originalname)

		// // Duplicate incoming stream
		// const pass1 = new stream.PassThrough();
		// const pass2 = new stream.PassThrough();
		// file.stream.pipe(pass1);
		// file.stream.pipe(pass2);

		// // Original WebP
		// const ogPromise = pass1.pipe(sharp().webp({ quality: 80 }).toFile(ogfilePath));

		// // Thumbnail WebP
		// const thumbPromise = pass2
		// 	.pipe(sharp()
		// 		.resize(100, 100, {
		// 			fit: "contain",
		// 			background: { r: 0, g: 0, b: 0, alpha: 1 }
		// 		})
		// 		.webp({ quality: 80 })
		// 		.toFile(thumbfilePath)
		// 	);

		// Promise.all([ogPromise, thumbPromise])
		// 	.then(() => {
		// 		cb(null, {
		// 			mimetype: file.mimetype,
		// 			filename: uniqueSuffix + file.originalname,
		// 			ogpath: ogfilePath,
		// 			thumbpath: thumbfilePath
		// 		});
		// 	})
		// 	.catch(cb);




		// Create two independent streams from the same upload
		const ogStream = new stream.PassThrough();
		const thumbStream = new stream.PassThrough();

		file.stream.pipe(ogStream);
		file.stream.pipe(thumbStream);

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
						.resize(100, 100, {
							fit: "contain",
							background: { r: 0, g: 0, b: 0, alpha: 1 }
						})
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
					filename: uniqueSuffix + file.originalname,
					ogpath: ogfilePath,
					thumbpath: thumbfilePath
				});
			})
			.catch(cb);
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

const upload = multer({ storage: newStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: filefilter })
module.exports = upload