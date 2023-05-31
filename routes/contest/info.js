import express from 'express'
import bodyParser from 'body-parser'
import jwt from "jsonwebtoken";
import UserModel from "../../app/models/UserModel.js";
import cors from "cors";
import ContestModel from "../../app/models/Contest.js";
import moment from "moment";

const contestInfoRouter = express.Router()
contestInfoRouter.use(bodyParser.json())
contestInfoRouter.use(cors({
    origin: '*'
}))

contestInfoRouter.get('/:contestId/joiner', async(req, res) => {
    const contestData = await ContestModel.findOne({
        where: {
            keyJoin: req.params.contestId
        },
        attributes: ['joiner']
    })
    if(contestData){
       let joinerListRaw = contestData.joiner.split(',')
        res.status(200).json({
            status: 'success',
            joinerList: joinerListRaw
        })
    }
})

contestInfoRouter.post('/:contestId/', (req, res) => {
    try {
        const userToken = req?.headers?.authorization?.split(' ')[1];
        const decoded = jwt.verify(userToken, process.env.JWT_TOKEN);
        if (decoded) {
            UserModel.findOne({
                where: {
                    username: decoded.userId
                },
                attributes: ['joinedContest']
            }).then((user) => {
                if (user) {
                    //get contestId from params
                    let joinedContest = req.params.contestId;
                    if(user.joinedContest !== joinedContest){
                        res.status(400).json({
                            status: 'failed',
                            message: 'joined another contest',
                            joinedContest: user.joinedContest,
                            reqContestId: joinedContest
                        })
                        return;
                    }
                    //check isset contest or not
                    ContestModel.findOne({
                        where: {
                            keyJoin: joinedContest
                        }
                    }).then((contest) => {
                        if(!contest){
                            res.status(404).json({
                                status: 'failed',
                                message: 'contest not found',
                                keyJoin : joinedContest
                            })
                        }else{
                            res.status(200).json({
                                status: 'success',
                                contestId: contest.id,
                                problemList: contest.problemList,
                                contestName: contest.name,
                                description: contest.description,
                                keyJoin: contest.keyJoin,
                                startAt: contest.startAt,
                                endAt: contest.endAt
                            })
                        }
                    }).catch((err) => {
                        res.status(200).json({
                            status: 'failed',
                            message: 'contest not found'
                        })
                        console.log(err)
                    })
                }
            })
        }
    }catch(err){
        res.status(401).json({
            status: 'fail',
            message: 'unauthorized'
        });
    }
})
export default contestInfoRouter