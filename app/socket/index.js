import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import ContestModel from '../models/Contest.js';
import UserModel from '../models/UserModel.js';
import redisClient from '../redis/index.js';
import moment from "moment";

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);



        socket.on('getJoinerList', async (reqData) => {
            const token = reqData?.token;
            try {
                jwt.verify(token, process.env.JWT_TOKEN);
                const contestId = reqData?.contestId;
                const contestData = await ContestModel.findOne({
                    where: {
                        keyJoin: contestId,
                    },
                    attributes: ['joiner'],
                })
                if (contestData) {
                    //get avatar, username
                    contestData.joiner = contestData.joiner || ''
                    let joinerList = contestData.joiner.split(',');
                    //get each avatar, username like [{username,avatar}, {username,avatar}]
                    try {
                        const users = await UserModel.findAll({
                            where: {
                                username: joinerList,
                            },
                            attributes: ['username', 'avatar'],
                            raw: true,
                        });

                        //!Send to only sender
                        io.to(socket.id).emit('serverSendJoinerList', users);
                        console.log('send joiner list success to ', socket.id);
                    } catch (err) {
                        io.to(socket.id).emit('serverSendError', 'error when getting joiner list');
                    }
                }
            }catch(err){
                console.log("error when get joiner list", err);
                io.to(socket.id).emit('serverSendError', 'token invalid');
            }
        })

        socket.on('clientJoiner', async (userData) => {
            let userToken = userData?.token;
            try {
                let userDecodeData = jwt.verify(userToken, process.env.JWT_TOKEN);
                //!check joiner list from contest model
                try {
                    const contest = await ContestModel.findOne({
                        where: {
                            keyJoin: userData.contestId,
                        },
                        attributes: ['joiner','inContestData'],
                    });

                    if (!contest) {
                        io.to(socket.id).emit('serverSendError', 'contest not found');
                    } else {
                        let joinerList = [];
                        if (contest.joiner) joinerList = contest.joiner.split(',');

                        if (!joinerList.includes(userDecodeData.userId)) {
                            let inContestData = []
                            try {
                                inContestData = JSON.parse(contest.inContestData);
                            } catch (err) {
                                inContestData = []
                            }

                            inContestData.push({
                                username: userDecodeData.userId,
                                score: 0,
                                joinAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                                rank:0
                            })
                            //add to list
                            joinerList.push(userDecodeData.userId);
                            await ContestModel.update(
                                {
                                    joiner: joinerList.join(','),
                                    inContestData: JSON.stringify(inContestData),
                                },
                                {
                                    where: {
                                        keyJoin: userData.contestId,
                                    },
                                }
                            );
                        }

                        //get data with each username and avatar like [{username,avatar},{username,avatar}]
                        try {
                            const users = await UserModel.findAll({
                                where: {
                                    username: joinerList,
                                },
                                attributes: ['username', 'avatar'],
                                raw: true,
                            });

                            //!Send to all clients in the room
                            io.emit('serverSendJoinerList', users);
                        } catch (err) {
                            io.to(socket.id).emit('serverSendError', 'error when getting joiner list');
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            } catch (err) {
                io.to(socket.id).emit('serverSendError', 'token invalid');
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.log('Connection error:', error);
        });
    });
};

export default initializeSocket;
