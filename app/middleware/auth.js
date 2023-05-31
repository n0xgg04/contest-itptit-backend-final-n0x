import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default function middleware(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        next();
    }catch(err){
        res.status(401).json({
            status: 'failed',
            message: 'Auth failed'
        })
    }
}