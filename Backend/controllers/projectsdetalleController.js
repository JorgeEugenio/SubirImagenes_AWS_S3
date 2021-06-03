const mongoose = require('mongoose')
const Projectsdetalle = require('../models/Projectsdetalle')

async function addProjectsdetalle(req, res){
    try {
        const {
            idProject,
            projectDetalleName,
            fechaAvance,
            tipoRecurso,
        } = req.body
        const projectdetalle = Projectsdetalle({
            idProject,
            projectDetalleName,
            fechaAvance,
            tipoRecurso,
        })
        if(req.file){
            const { filename} = req.file
            projectdetalle.setUrlRecurso( filename)
            console.log('pase un file');
        }
        await projectdetalle.save()  
        res.status(201).send(projectdetalle)
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function getProjectsdetalles(req, res){
    try {
        const projectdetalles = await Projectsdetalle.aggregate()
                                        .match({})
                                        .lookup({
                                            from: 'projects',
                                            localField: 'idProject',
                                            foreignField: '_id',
                                            as: 'detalles'
                                        })
                                        .replaceRoot({
                                            detalles: { $mergeObjects: [ { $arrayElemAt: [ "$detalles", 0]}, "$$ROOT"]}
                                        })
                                        .project({
                                            "_id": "$detalles._id",
                                            "nombreProjectsdetalle":"$detalles.nombreProject",
                                            "personacargoProjectsdetalle":"$detalles.personacargoProject",
                                            "projectDetalleName":"$detalles.projectDetalleName",
                                            "fechaAvance":"$detalles.fechaAvance",
                                            "tipoRecurso":"$detalles.tipoRecurso",
                                            "urlRecurso":"$detalles.urlRecurso",
                                            "createdAt": { $concat : [{$substr :["$detalles.createdAt",0 ,10]},":",{$substr :["$createdAt", 11,5]}]},
                                            "updatedAt": { $concat : [{$substr :["$detalles.updatedAt",0 ,10]},":",{$substr :["$updatedAt", 11,5]}]}
                                        })
        res.status(200).send(projectdetalles)
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function updateProjectsdetalle(req, res){
    try {
        await Projectsdetalle.findByIdAndUpdate(req.body)
        res.status(200).send({ status: 'Projectsdetalle actualizado'})
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function deleteProjectsdetalle(req, res){
    try {
        await Projectsdetalle.findByIdAndDelete(req.params.id)
        res.status(200).send({ status: 'Projectsdetalle eliminado'})
    } catch (e) {
        res.status(500).send({ message: e.message})
    }
}

async function getProjectsdetalle(req, res){
    try {
        const projectdetalle = await Projectsdetalle.aggregate()
                                        .match({'idProject': mongoose.Types.ObjectId(req.params.id)})
                                        .lookup({
                                            from: 'projects',
                                            localField: 'idProject',
                                            foreignField: '_id',
                                            as: 'detalle'
                                        })
                                        .unwind('$detalle')
                                        .lookup({
                                            from: 'users',
                                            localField: 'detalle.personacargoProject',
                                            foreignField: '_id',
                                            as: 'detalle1'
                                        })
                                        .unwind('$detalle1')
                                        .project({
                                            "detalle_idProject":"$idProject",
                                            "detalle_projectDetalleName":"$projectDetalleName",
                                            "detalle_fechaAvance":"$fechaAvance",
                                            "detalle_tipoRecurso":"$tipoRecurso",
                                            "detalle_urlRecurso":"$urlRecurso",
                                            "detalle_createdAt":"$createdAt",
                                            "detalle_updatedAt":"$updatedAt",
                                            "project_name":"$detalle.nombreProject",
                                            "user_nombres":"$detalle1.nombres",
                                            "user_apellidos":"$detalle1.apellidos",
                                            "user_email":"$detalle1.email",
                                            "user_imgUrl":"$detalle1.imgUrl",
                                            "user_nombres":"$detalle1.nombres",
                                        })
                                        //console.log(projectdetalle);
        res.status(200).send(projectdetalle)
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

module.exports = {
    addProjectsdetalle,
    getProjectsdetalles,
    updateProjectsdetalle,
    deleteProjectsdetalle,
    getProjectsdetalle
}