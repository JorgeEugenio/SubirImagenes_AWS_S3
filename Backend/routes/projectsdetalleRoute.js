const express = require('express')
const upload = require('../libs/storageProject')
const {
    addProjectsdetalle,
    getProjectsdetalles,
    updateProjectsdetalle,
    deleteProjectsdetalle,
    getProjectsdetalle
} = require('../controllers/projectsdetalleController')

const api = express.Router()
    api.post('/projectsdetalle',upload.single('image'), addProjectsdetalle)
    api.get('/projectsdetalle', getProjectsdetalles)
    api.put('/projectsdetallexid/:id', updateProjectsdetalle)
    api.delete('/projectsdetallexid/:id',deleteProjectsdetalle)
    api.get('/projectsdetallexid/:id',getProjectsdetalle)
    
module.exports = api