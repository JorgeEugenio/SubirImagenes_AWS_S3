import axios from 'axios'
const { ENDPOINT_PATH } = require('../Config')
const urlBase = ENDPOINT_PATH +'participante'
export default class Project{
    create(participante){
        return axios.post( urlBase, participante )
    }
    read(){
        return axios.get( urlBase )
    }

    update(participanteId, participante){
        console.log(urlBase + '/'+participanteId);
        return axios.put( urlBase + '/'+participanteId, participante)
    }

    delete(participanteId){
        return axios.delete(urlBase + '/' + participanteId)
    }
    readParticipante(participanteId){
        return axios.get( ENDPOINT_PATH + 'participantedetalle/' + participanteId)
    }

    filtroIdEvento(participanteId){
        return axios.get( ENDPOINT_PATH + 'participantefiltroidevento/' + participanteId)
    }
}