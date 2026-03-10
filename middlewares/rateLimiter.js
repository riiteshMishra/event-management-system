const rateLimit = require("express-rate-limit");

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // max 100 requests
//     message: {
//         success: false,
//         message: "Too many requests, please try again later.",
//     },
//     standardHeaders: true,
//     legacyHeaders: false,
// });

// module.exports = limiter;

const rateLimiter = (maxRequest = 100, time = 10) => rateLimit({
    windowMs: time * 60 * 1000,// dynamic time
    max: maxRequest, // dynamic max request  100
    message: {
        success: false,
        message: "Bas kar bhai pichha chhod de "
    },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = rateLimiter