const farmHash = require('farmhash')

exports.uniqueName = async (req, res, next) => {
	const realIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
	req.realIp = realIp
	if(req.params.threadId){
		req.uniqueName = farmHash.hash32WithSeed(realIp, Number(req.params.threadId)).toFixed(0)
	}
	// else{
	// 	req.uniqueName = farmHash.hash32(realIp).toFixed(0)
	// }
	next()
}
