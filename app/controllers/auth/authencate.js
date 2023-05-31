import UserModel from '../../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

class Authenticate {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async encryptPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    }

    async login() {
        console.log(this.req.body);
        let password = await bcrypt.hash(this.req.body.password, 10);

        try {
            const user = await UserModel.findOne({
                where: {
                    username: this.req.body.username,
                },
            });

            if (user) {
                const isMatch = await bcrypt.compare(this.req.body.password, user.password);
                if (isMatch) {
                    const token = jwt.sign({
                        userId: this.req.body.username,
                        name : user.name,
                        quotes : user.quotes,
                        joinedContest : user.joinedContest
                    }, process.env.JWT_TOKEN, { expiresIn: '1h' });
                    this.response({
                        status: 'success',
                        message: 'success',
                        token: token,
                        joinedContest : user.joinedContest
                    }, 200);
                    return;
                }
            }

            this.response({
                status: 'fail',
                message: 'login fail',
                hashPassword: password,
            }, 401);

        } catch (err) {
            this.response({
                status: 'failed',
                message: 'wrong password',
            }, 200);
        }
    }

    response(obj, status) {
        this.res.json(obj).status(status);
    }
}

export default Authenticate;
