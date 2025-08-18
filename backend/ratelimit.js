const ip = require("request-ip")

exports.ratelimit = (increasetime = 5000, map) => async (req, res, next) => {
	const address = ip.getClientIp(req)
	const currenttime = Date.now()
	if(map[address] == undefined){
		map[address] = currenttime + increasetime
		return next()
	}
	else if(map[address] - currenttime  > 0){
		map[address] += increasetime
		return res.status(429).json(`Wait ${Math.trunc((map[address] - currenttime)/1000)} seconds.`)
	}else{
		map[address] = currenttime + increasetime
		return next()
	}
}