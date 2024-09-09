import jwt from 'jsonwebtoken';
import ItemModel from '../model/Item.model.js'
import ENV from '../config.js'
import dotenv from 'dotenv';
dotenv.config()

// auth middleware
export async function Auth(req, res, next) {
    try {
        // access authorize header to validate request
        let token;
        token = req.cookies.access_token
        // token = req.cookies.token
        //  retrive the user details of the logged in user
        if (token) {
            try {
                const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
                // req.user = await UserModel.findById({ _id: decodedToken });
                req.user = decodedToken
                // res.status(200).send({ msg: "Authorized user" })
                next()
            } catch (error) {
                res.status(401).send({ error: "No Authorized, Invalid Token" })
            }
        } else {
            res.status(401).send({ error: "No Authorized, No Token" })
        }
    } catch (error) {
        res.status(401).send({ error: "Authentication failed" })
    }
}

// auth session middleware
export async function AuthSession(req, res, next) {
    try {
        // access authorize header to validate request
        const token = req.session.token
        if (token) {
            try {
                // User is authenticated
                const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)
                req.user = decodedToken
                next()
            } catch (error) {
                res.status(401).send({ error: "No Authorized, Invalid Token" })
            }
        } else {
            res.status(401).send({ error: "No Authorized, No Token" })
        }
    } catch (error) {
        res.status(401).send({ error: "Authentication failed" })
    }
}

// auth middleware
export function Restrict(role) {
    return async (req, res, next) => {
        if (req.user.role !== role) {
            res.status(403).send({ error: "No Authorized" })
        }
        next()
    }
}