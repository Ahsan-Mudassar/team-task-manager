import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 100,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        sucess: false,
        message: "Too many request attempts, Please try again later"
    }
})