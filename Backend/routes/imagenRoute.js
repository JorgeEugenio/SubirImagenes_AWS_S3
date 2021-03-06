const express = require('express')
const upload = require('../libs/storageProject')
const {
    addImagen,
    getImagenes,
    updateImagen,
    deleteImagen
} = require('../controllers/ImagenController')

const api = express.Router()

    api.post('/imagen/', upload.single('imgUrl'), addImagen)
    api.get('/imagen', getImagenes)
    api.put('/imagen/:id', updateImagen)
    api.delete('/imagen/:id',deleteImagen)
    
module.exports = api