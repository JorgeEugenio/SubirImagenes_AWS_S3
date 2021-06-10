const mongoose = require('mongoose')
const { appConfig} = require('../config')
const Schema = mongoose.Schema

const imagenSchema = Schema({
    idUser: {
        type: String,
        default: ''
    },
    nombreCarpeta: {
        type: String,
        default: ''
    },
    cantidadImagenes: {
        type: Number,
        default: 0
    },
    imgUrl: String,
    descripcion: {
        type: String,
        default: ''
    }
},
{
    timestamps: true
})


imagenSchema.methods.setImgUrl = function setImgUrl( filename ){
    const { host, port} = appConfig
    this.imgUrl = `${host}:${port}/public/${filename}`
}

module.exports = mongoose.model('Imagen', imagenSchema) 