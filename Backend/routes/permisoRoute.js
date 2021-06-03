const express = require('express')
const {
    addPermiso,
    getPermisos,
    updatePermiso,
    deletePermiso
} = require('../controllers/permisoController')

const api = express.Router()

    api.post('/permiso/', addPermiso)
    api.get('/permiso', getPermisos)
    api.put('/permiso/:id', updatePermiso)
    api.delete('/permiso/:id',deletePermiso)
    
module.exports = api