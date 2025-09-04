const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
// const ip = require('request-ip')

exports.uniqueName = async (req, res, next) => {
	const realIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
	const shortName = uniqueNamesGenerator({
		dictionaries: [adjectives, animals], // colors can be omitted here as not used
		seed: realIp
	});
	console.log(ip.getClientIp(req), shortName)
	req.uniqueName = shortName
	next()
}
