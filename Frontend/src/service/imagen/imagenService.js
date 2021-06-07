import axios from 'axios'
const { ENDPOINT_PATH } = require('../Config')
const urlBase = ENDPOINT_PATH +'imagen'
export default class Imagen{
    create(imagen){
        return axios.post( urlBase, imagen )
    }
    read(){
        return axios.get( urlBase )
    }

    update(imagenId, imagen){
        return axios.put( urlBase + '/'+imagenId, imagen)
    }

    delete(imagenId){
        return axios.delete(urlBase + '/' + imagenId)
    }
    readImagen(imagenId){
        return axios.get( ENDPOINT_PATH + 'imagen/' + imagenId)
    }
}