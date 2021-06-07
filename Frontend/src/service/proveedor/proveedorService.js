import axios from 'axios'
const { ENDPOINT_PATH } = require('../Config')
const urlBase = ENDPOINT_PATH +'proveedor'
export default class Evento{
    create(proveedor){
        return axios.post( urlBase, proveedor )
    }
    read(){
        return axios.get( urlBase )
    }

    update(proveedorId, proveedor){
        return axios.put( urlBase + '/'+proveedorId, proveedor)
    }

    delete(proveedorId){
        return axios.delete(urlBase + '/' + proveedorId)
    }
    readOne(proveedorId){
        return axios.get( ENDPOINT_PATH + 'proveedordetalle/' + proveedorId)
    }
}