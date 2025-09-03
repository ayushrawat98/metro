const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const ip = require('request-ip')

exports.uniqueName = async (req, res, next) => {
	const shortName = uniqueNamesGenerator({
		dictionaries: [adjectives, animals], // colors can be omitted here as not used
		style: 'capital',
		seed: ip.getClientIp(req)
	});
	req.uniqueName = shortName
	next()
}
