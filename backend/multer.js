const multer = require('multer')

const filefilter = (req, file, cb) => {
	// 'video/mp4', 'video/webm',
    let allowed = ['image/jpg','image/jpeg','image/png','image/gif']
    if(allowed.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb({message: 'Unsupported File Format'}, false)
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

const upload = multer({storage : storage, limits : {fileSize : 5*1024*1024}, fileFilter : filefilter})
module.exports = upload