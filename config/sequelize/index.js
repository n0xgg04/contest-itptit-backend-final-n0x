import Sequelize from 'sequelize'
import config from '../config.js'

var conn = new Sequelize(config.db.dbname,config.db.username, config.db.password,{
    host: 'localhost',
    dialect: 'mysql',
    pool:{
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: false
})

export default conn;