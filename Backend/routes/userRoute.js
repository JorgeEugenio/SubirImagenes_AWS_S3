const express = require('express')
 const {
    addUser,
    getUsers,
    getUserxEmail,
    getUserEmailPassword,
    updateUser,
    updateUserxEmail,
    deleteUser,
    getUserxId
 } = require('../controllers/userController')

 const api = express.Router()
    api.post('/user',addUser)
    api.get('/user',getUsers)
    api.get('/user/:email',getUserxEmail)
    api.get('/user/:email/:password',getUserEmailPassword)
    api.put('/user/:id',updateUser)
    api.put('/userxemail/:email',updateUserxEmail)
    api.delete('/user/:id',deleteUser)
    api.get('/userid/:id',getUserxId)

 module.exports = api