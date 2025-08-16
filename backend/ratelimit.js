const ip = require("request-ip")
let map = {}
exports.ratelimit = async (req, res, next) => {
	const address = ip.getClientIp(req)
	
	if(map[address] == undefined){
		map[address] = Date.now()
		return next()
	}
	else if(Date.now() - map[address]  < 5000){
		map[address] = Date.now()
		return res.status(429).json(`Wait 5 seconds.`)
	}else{
		map[address] = Date.now()
		return next()
	}
}