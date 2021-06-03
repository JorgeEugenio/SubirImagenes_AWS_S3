const mongoose = require('mongoose')
const User = require('../models/User.js')

async function addUser(req,res){
    try {
        const {
            nombres,
            apellidos,
            email,
            password

        } = req.body

        const usuario = User({
            nombres,
            apellidos,
            email,
            password
        })

        if (req.file) {
            const { filename } = req.file
            usuario.setImgUrl(filename)
        }
        await usuario.save()
        res.status(201).json(usuario)
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

async function getUsers(req,res){
    try {
        const usuarios = await User.aggregate()
                                    .lookup({
                                        from: 'permisos',
                                        localField: 'idPermiso',
                                        foreignField: '_id',
                                        as: 'detalles'
                                    })
                                    .replaceRoot({
                                        detalles: { $mergeObjects: [{$arrayElemAt: ["$detalles",0]}, "$$ROOT"]}
                                    })
                                    .project({
                                        "_id":"$detalles._id",
                                        "idPermiso":"$detalles.idPermiso", 
                                        "nombrePermiso":"$detalles.nombrePermiso", 
                                        "detallePermiso":"$detalles.detallePermiso", 
                                        "nombres":"$detalles.nombres",
                                        "apellidos":"$detalles.apellidos",
                                        "email":"$detalles.email",        
                                        "imgUrl":"$detalles.imgUrl",        
                                        "createdAt":"$detalles.createdAt",
                                        "updatedAt":"$detalles.updatedAt",
                                    })
        res.status(200).json(usuarios)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

async function getUserxEmail(req,res){
    try {
        const usuario = await User.aggregate()
                            .match({
                                "email": req.params.email
                            })
                            .project({
                                "_id": "1",
                                "nombres":"$nombres",
                                "apellidos":"$apellidos",
                                "email":"$email",
                                "imgUrl":"$imgUrl",
                            })
        res.json(usuario)
    } catch (e) {
        res.status(500).json({ message: e. message})
    }
}

async function getUserEmailPassword(req,res){
    try {
        const usuario = await User.aggregate()
                            .match({
                                "email": req.params.email,
                                "password": req.params.password,
                            })
                            .project({
                                "_id": "1",
                                "nombres":"$nombres",
                                "apellidos":"$apellidos",
                                "email":"$email",
                                "imgUrl":"$imgUrl",
                            })
        res.json(usuario)
    } catch (e) {
        res.status(500).json({ message: e. message})
    }
}

async function updateUser(req,res){
    try {
        await usuario.findByIdAndUpdate(req.params.id)
        res.json({status: 'Usuario Actualizado'})
    } catch (e) {
        res.status(500).json({ message: e.message})
    }
}
async function updateUserxEmail(req,res){
    try {
        console.log(req.params);
        console.log(req.body);
        await User.findOneAndUpdate({ email : req.params.email}, req.body)
        
        res.json({status: 'Usuario Actualizado'})
    } catch (e) {
        res.status(500).json({ message: e.message})
    }
}

async function deleteUser(req,res){
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({status: 'Usuario Eliminado'})
    } catch (e) {
        res.status(500).json({ message: e.message})
    }
}

async function getUserxId(req,res){
    try {
        const usuario = await User.aggregate()
                            .match({"_id": mongoose.Types.ObjectId(req.params.id)})
                            .lookup({
                                from: 'permisos',
                                localField: 'idPermiso',
                                foreignField: '_id',
                                as: 'detalles'
                            })
                            .replaceRoot({
                                detalles: { $mergeObjects: [{$arrayElemAt: ["$detalles",0]}, "$$ROOT"]}
                            })
                            .project({
                                "_id":"$detalles._id",
                                "idPermiso":"$detalles.idPermiso", 
                                "nombrePermiso":"$detalles.nombrePermiso", 
                                "detallePermiso":"$detalles.detallePermiso", 
                                "nombres":"$detalles.nombres",
                                "apellidos":"$detalles.apellidos",
                                "email":"$detalles.email",        
                                "imgUrl":"$detalles.imgUrl",        
                                "createdAt":"$detalles.createdAt",
                                "updatedAt":"$detalles.updatedAt",
                            })
        res.json(usuario[0])
    } catch (e) {
        res.status(500).json({ message: e. message})
    }
}

module.exports = {
    addUser,
    getUsers,
    getUserxEmail,
    getUserEmailPassword,
    updateUser,
    updateUserxEmail,
    deleteUser,
    getUserxId
}