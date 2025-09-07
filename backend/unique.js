const farmHash = require('farmhash')
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');


exports.uniqueName = async (req, res, next) => {
	const realIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
	req.realIp = realIp
	if(req.params.threadId){
		req.uniqueName = farmHash.hash32WithSeed(realIp, Number(req.params.threadId)).toFixed(0)
	}
	// if(req.params.threadId){
	// 	const shortName = uniqueNamesGenerator({
	// 		dictionaries: [colors, adjectives, animals], // colors can be omitted here as not used
	// 		seed: realIp + req.params.threadId
	// 	});
	// 	req.uniqueName = shortName
	// }
	next()
}
