const mongoose = require('mongoose')
const { appConfig } = require('../config')
const Schema = mongoose.Schema

const projectdetalleSchema = Schema({
    idProject: mongoose.ObjectId,
    projectDetalleName: String,
    fechaAvance: Date,
    tipoRecurso: String,
    urlRecurso: String
},
{
    timestamps: true
})


/* projectdetalleSchema.methods.setUrlRecurso = function setUrlRecurso(fileroute, filename){
    const  { host, port } = appConfig
    this.urlRecurso = `${host}:${port}/public/${fileroute}/${filename}`
} */

projectdetalleSchema.methods.setUrlRecurso = function setUrlRecurso(filename){
    const  { host, port } = appConfig
    this.urlRecurso = `http://${host}:${port}/public/${filename}`
    console.log(this.urlRecurso);
}
module.exports = mongoose.model('Projectsdetalle', projectdetalleSchema)