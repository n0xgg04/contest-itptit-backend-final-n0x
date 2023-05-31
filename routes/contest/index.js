import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import UserModel from '../../app/models/UserModel.js';
import cors from 'cors';
import ContestModel from '../../app/models/Contest.js';
import middleware from '../../app/middleware/auth.js';

const contestRoute = express.Router();
contestRoute.use(bodyParser.json());
contestRoute.use(
    cors({
        origin: '*',
    })
);

//use middleware
contestRoute.use(middleware);

contestRoute.post('/join', async (req, res) => {
    try {
        const userToken = req?.headers?.authorization?.split(' ')[1];
        const decoded = jwt.verify(userToken, process.env.JWT_TOKEN);
        if (decoded) {
            const user = await UserModel.findOne({
                where: {
                    username: decoded.userId,
                },
                attributes: ['joinedContest'],
            });

            if (user) {
                let joinedContest = req.body?.contestId;
                if (user.joinedContest) {
                    res.status(200).json({
                        status: 'failed',
                        message: 'already joined another contest',
                    });
                    return;
                }

                try {
                    const contest = await ContestModel.findOne({
                        where: {
                            keyJoin: joinedContest,
                        },
                        attributes: ['joiner','inContestData'],
                    });

                    if (!contest) {
                        res.status(200).json({
                            status: 'failed',
                            message: 'contest not found',
                            keyJoin: joinedContest,
                        });
                    } else {
                        await UserModel.update(
                            {
                                joinedContest: joinedContest,
                            },
                            {
                                where: {
                                    username: decoded.userId,
                                },
                            }
                        );

                        const newtoken = jwt.sign(
                            {
                                userId: decoded.userId,
                                name: decoded.name,
                                quotes: decoded.quotes,
                                joinedContest: joinedContest,
                            },
                            process.env.JWT_TOKEN,
                            { expiresIn: '24h' }
                        );

                        res.status(200).json({
                            status: 'success',
                            message: 'success',
                            token: newtoken,
                            joinedContest: joinedContest,
                        });
                    }
                } catch (err) {
                    res.status(200).json({
                        status: 'failed',
                        message: 'contest not found',
                    });
                    console.log(err);
                }
            }
        }
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'unauthorized',
        });
    }
});

export default contestRoute;
