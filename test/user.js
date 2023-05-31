import UserModel from '../app/models/UserModel.js'

UserModel.create({
    username: 'test',
    password: 'test'
}).then((user) => {
    console.log("user created")
}).catch((err) => {
    console.log("user not created  "+ err)
})