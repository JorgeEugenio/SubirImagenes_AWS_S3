const mongoose = require('mongoose')

const Schema = mongoose.Schema

const permisoSchema = Schema({
    nombrePermiso: String,
    detallePermiso: String,
    //iddetalleProject: mongoose.ObjectId,
},
{
    timestamps: true
})

module.exports = mongoose.model('Permiso', permisoSchema)