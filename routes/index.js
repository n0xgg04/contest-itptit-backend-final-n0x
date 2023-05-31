import express from 'express'
import bodyParser from 'body-parser'
import authRouter from './auth/index.js'
import contestRouter from './contest/index.js'
import contestInfoRouter from './contest/info.js'

const router = express.Router()
router.use(bodyParser.json())

router.get('/', (req, res) => {
    res.send('Hello World!');
})

router.use('/api/auth/', authRouter);
router.use('/api/contest/', contestRouter);


router.use('/api/contestInfo/',contestInfoRouter);
export default router