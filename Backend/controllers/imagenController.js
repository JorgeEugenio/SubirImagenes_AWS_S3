const mongoose = require('mongoose')
const fs = require('fs')
const Imagen = require('../models/Imagen')


async function addImagen(req, res){
    try {
        const {
            idUser,
            nombreCarpeta,
            cantidadImagenes,
            descripcion
        } = req.body
        const imagen = Imagen({
            idUser,
            nombreCarpeta,
            cantidadImagenes,
            descripcion
        })
         fs.mkdir(`./storage/img/${imagen._id}`, { recursive: true }, (err) => {
            if (err) throw err;
          });
          if(req.file){
              const { filename } = req.file
              imagen.setImgUrl(filename)
              console.log('pase un file');
          }
        await imagen.save()
        res.status(201).send(imagen._id)
        
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function getImagenes(req, res){
    try {
        const imagenes = await Imagen.aggregate()
                                        .match({})
                                        .lookup({
                                            from: 'users',
                                            localField: 'idUser',
                                            foreignField: '_id',
                                            as: 'detalles'
                                        })
                                        .replaceRoot({
                                            detalles: { $mergeObjects: [ { $arrayElemAt: [ "$detalles", 0]}, "$$ROOT"]}
                                        })
                                        .project({
                                            "_id":"$detalles._id",
                                            "nombreCarpeta":"$detalles.nombreCarpeta",
                                            "cantidadImagenes":"$detalles.cantidadImagenes",
                                            "imgUrl":"$detalles.imgUrl",
                                            "descripcion":"$detalles.descripcion"
                                        })
        res.status(200).send(imagenes)
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function updateImagen(req, res){
    try {
        await Imagen.findByIdAndUpdate(req.body)
        res.status(200).send({ status: 'Imagen actualizado'})
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

async function deleteImagen(req, res){
    try {
        await Imagen.findByIdAndDelete(req.params.id)
        fs.rmdir(`./storage/img/${req.params.id}`, { recursive: true }, (err) => {
            if (err) throw err;
          });
        res.status(200).send({ status: 'Imagens eliminado'})
    } catch (e) {
        res.status(500).send({ message: e.message})
    }
}

async function getImagen(req, res){
    try {
        const imagen = await Imagen.aggregate()
                                        .match({'_id':req.params.id})
                                        .lookup({
                                            from: 'users',
                                            localField: 'personacargoImagen',
                                            foreignField: '_id',
                                            as: 'detalles'
                                        })
                                        .replaceRoot({
                                            detalles: { $mergeObjects: [ { $arrayElemAt: [ "$detalles", 0]}, "$$ROOT"]}
                                        })
                                        .imagen({
                                            "_id":"$detalles._id",
                                            "nombreImagen":"$detalles.nombreImagen",
                                            "nombreUser":"$detalles.nombres",
                                            "apellidoUser":"$detalles.apellidos",
                                            "emailUser":"$detalles.email",
                                            "imgUrlUser":"$detalles.imgUrl"
                                        })
        res.status(200).send(imagen[0])
    } catch (e) {
        res.status(500).send({message: e.message})
    }
}

module.exports = {
    addImagen,
    getImagenes,
    updateImagen,
    deleteImagen,
    getImagen
}