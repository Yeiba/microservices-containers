import jwt from 'jsonwebtoken';

const httpOnlyCookie = (res, userId) => {
    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.status(201).cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
}

const sessionToken = (res, req, userId) => {
    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET, { expiresIn: "30d" })

    req.session.token = token
}

export { httpOnlyCookie, sessionToken }