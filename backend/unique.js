const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const ip = require('request-ip')

exports.uniqueName = async (req, res, next) => {
	const shortName = uniqueNamesGenerator({
		dictionaries: [adjectives, animals], // colors can be omitted here as not used
		seed: ip.getClientIp(req)
	});
	console.log(ip.getClientIp(req), shortName)
	req.uniqueName = shortName
	next()
}
