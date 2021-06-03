const mongoose = require('mongoose')

const Schema = mongoose.Schema

const projectSchema = Schema({
    nombreProject: String,
    personacargoProject: mongoose.ObjectId,
    //iddetalleProject: mongoose.ObjectId,
},
{
    timestamps: true
})

module.exports = mongoose.model('Project', projectSchema)