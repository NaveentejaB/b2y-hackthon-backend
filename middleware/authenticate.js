const jwt = require("jsonwebtoken")

const authenticate = async (req, res, next) => {
	const token = req.headers["authorization"] 
	if (!token)
		return res.status(403).json({ 
            error: true, 
            message: "Access Denied: No token provided" 
        })
	try {
		let isJwtValid = false
		const tokenDetails = jwt.verify(token,process.env.ACCESS_TOKEN_PRIVATE_KEY,(err,data)=>{
			if(err)
				{return;}
			isJwtValid=true
		})
		if(!isJwtValid){
			res.status(403).json({
			error:true,
			message:"Invalid token"
		})
		}
		req.user = tokenDetails
		next()
	} catch (err) {
		res.status(403).json({ 
            error: true, 
            message: "Access token is expired" 
        })
	}
}

const checkRole = (permission) =>{
    return (req, res, next) =>{
		const token = req.headers["authorization"]
		const decoded = jwt.decode(token)
        const userRole = decoded.role	
        if(permission == userRole){
            next()
        }else{
            return res.status(403).json({
                 message: 'Unauthorized access', 
            });
        }
    }
}

module.exports = {checkRole,authenticate}

