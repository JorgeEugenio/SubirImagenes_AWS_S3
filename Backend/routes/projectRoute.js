const express = require('express')
const {
    addProject,
    getProjects,
    updateProject,
    deleteProject,
    getProject
} = require('../controllers/projectController')

const api = express.Router()

    api.post('/project/', addProject)
    api.get('/project', getProjects)
    api.put('/project/:id', updateProject)
    api.delete('/project/:id',deleteProject)
    api.get('/projectdetalle/:id',getProject)
    
module.exports = api