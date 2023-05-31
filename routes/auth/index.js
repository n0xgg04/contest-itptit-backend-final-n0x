import express from 'express'
import bodyParser from 'body-parser'
import Authencate from '../../app/controllers/auth/authencate.js'
import cors from "cors";

var authRouter = express.Router()

authRouter.use(bodyParser.json())
authRouter.use(cors({
    origin: '*'
}));


authRouter.post('/login', async(req, res) => {
    const auth = new Authencate(req,res);
    await auth.login();
})

authRouter.get('/logout', (req, res) => {
    res.send('logout');
})
export default authRouter