const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user) {
    const payload = {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        },
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

module.exports = jwtGenerator;
