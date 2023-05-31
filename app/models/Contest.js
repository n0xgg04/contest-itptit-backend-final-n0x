import conn from '../../config/sequelize/index.js';
import { DataTypes, Model } from 'sequelize';

class ContestModel extends Model {}

ContestModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        keyJoin: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        startAt : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        endAt : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        onlyFor: {
            type: DataTypes.STRING,
            allowNull: true
        },
        joiner: {
            type: DataTypes.STRING,
            allowNull: true
        },
        problemList: {
            type: DataTypes.STRING,
            allowNull: true
        },
        inContestData:{
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt:{
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        sequelize: conn, // Use the imported connection
        modelName: 'contests',
    })

export default ContestModel;