require('dotenv').config({path: '/.env'});
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        return (
            res.status(403).json({
                status: false,
                msg: "A token is required for authentication..."
            })
        )
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        console.log(error);
        return (
            res.status(401).json({
                status: false,
                msg: "Invalid Token...",
                data: error
            })
        )
    }
    return next();
}

module.exports = verifyToken;