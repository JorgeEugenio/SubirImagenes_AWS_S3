import axios from 'axios'
const { ENDPOINT_PATH } = require('../Config')
const urlBase = ENDPOINT_PATH +'eventodetalle'
export default class Eventodetalle{
    create(file, eventodetalle){
        return axios.post( ENDPOINT_PATH +'eventosdetalle',file, eventodetalle )
    }
    read(){
        return axios.get( urlBase )
    }

    update(eventodetalleId, eventodetalle){
        return axios.put( urlBase + '/'+eventodetalleId, eventodetalle)
    }

    delete(eventodetalleId){
        return axios.delete(ENDPOINT_PATH +'eventosdetallexid' + '/' + eventodetalleId)
    }
    readOne(eventodetalleId){
        return axios.get( ENDPOINT_PATH + 'eventosdetallexid/' + eventodetalleId)
    }
    filtroIdEvento(idEvento){
        return axios.get( ENDPOINT_PATH + 'eventodetallefiltroidevento/' + idEvento )
    }
}