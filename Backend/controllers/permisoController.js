const mongoose = require('mongoose')
const Permiso = require('../models/Permiso')


async function addPermiso(req, res){
    try {
        const {
            nombrePermiso,
            detallePermiso
        } = req.body
        const permiso = Permiso({
            nombrePermiso,
            detallePermiso
        })
        await permiso.save()  
        res.status(201).send(permiso)
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function getPermisos(req, res){
    try {
        const permisos = await Permiso.aggregate()
                                        .project({
                                            "_id":"$_id",
                                            "nombrePermiso":"$nombrePermiso",
                                            "detallePermiso":"$detallePermiso"
                                        })
        res.status(200).send(permisos)
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function updatePermiso(req, res){
    try {
        await Permiso.findByIdAndUpdate(req.body)
        res.status(200).send({ status: 'Permiso actualizado'})
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function deletePermiso(req, res){
    try {
        await Permiso.findByIdAndDelete(req.params.id)
    } catch (e) {
        res.status(500).send({ message: e.message})
    }
}

module.exports = {
    addPermiso,
    getPermisos,
    updatePermiso,
    deletePermiso
}