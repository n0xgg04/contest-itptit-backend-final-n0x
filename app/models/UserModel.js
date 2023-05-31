import conn from '../../config/sequelize/index.js';
import { DataTypes, Model } from 'sequelize';

class UserModel extends Model {}

UserModel.init(
    {
        uid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100],
            },
            unique: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        quotes: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100],
            },
        },
        joinedContest:{
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize: conn, // Use the imported connection
        modelName: 'users',
    }
);

export default UserModel;
