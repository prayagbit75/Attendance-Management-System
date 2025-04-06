const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]; // Token extract karna
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token verify karna
            req.teacher = await Teacher.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, invalid token" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };
