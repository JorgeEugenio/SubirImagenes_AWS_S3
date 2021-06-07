import axios from 'axios'
const { ENDPOINT_PATH } = require('../Config')
const urlBase = ENDPOINT_PATH +'proveedorproducto'
export default class Proveedordetalle{
    create(file, proveedorproducto){
        return axios.post( ENDPOINT_PATH +'proveedorproducto',file, proveedorproducto )
    }
    read(){
        return axios.get( urlBase )
    }

    update(proveedorproductoId, proveedorproducto){
        return axios.put( urlBase + '/'+proveedorproductoId, proveedorproducto)
    }

    delete(proveedorproductoId){
        return axios.delete(urlBase + '/' + proveedorproductoId)
    }
    readOne(proveedorproductoId){
        return axios.get( ENDPOINT_PATH + 'proveedoresdetallexid/' + proveedorproductoId)
    }
    filtroIdProveedor(idProveedor){
        return axios.get( ENDPOINT_PATH + 'proveedorproductofiltroidproveedor/' + idProveedor )
    }
}