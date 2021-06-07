import axios from 'axios'
const { ENDPOINT_PATH } = require('../Config')
const urlBase = ENDPOINT_PATH +'evento'
export default class Evento{
    create(evento){
        return axios.post( urlBase, evento )
    }
    read(){
        return axios.get( urlBase )
    }

    update(eventoId, evento){
        return axios.put( urlBase + '/'+eventoId, evento)
    }

    delete(eventoId){
        return axios.delete(urlBase + '/' + eventoId)
    }
    readOne(eventoId){
        return axios.get( ENDPOINT_PATH + 'eventodetalle/' + eventoId)
    }
}