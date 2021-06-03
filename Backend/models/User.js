const mongoose = require('mongoose')
const { appConfig } = require('../config')

const Schema = mongoose.Schema

const userSchema = Schema({
    nombres: String,
    apellidos: String,
    email: String,
    password: String,
    imgUrl: String,
    idPermiso: mongoose.ObjectId
},
{
    timestamps: true
})
userSchema.methods.setImgUrl =function setImgUrl(filename){
    const {host, port } = appConfig
    this.imgUrl =`${host}:${port}/public/${filename}`
}

module.exports = mongoose.model('User', userSchema)