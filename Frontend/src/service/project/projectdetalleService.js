import axios from 'axios'
const { ENDPOINT_PATH } = require('../Config')
const urlBase = ENDPOINT_PATH +'projectsdetalle'
export default class Projectdetalle{
    create(file, projectdetalle){
        return axios.post( ENDPOINT_PATH +'projectsdetalle',file, projectdetalle )
    }
    read(){
        return axios.get( urlBase )
    }

    update(projectdetalleId, projectdetalle){
        return axios.put( urlBase + '/'+projectdetalleId, projectdetalle)
    }

    delete(projectdetalleId){
        return axios.delete(ENDPOINT_PATH +'projectsdetallexid' + '/' + projectdetalleId)
    }
    readProjectxId(projectdetalleId){
        return axios.get( ENDPOINT_PATH + 'projectsdetallexid/' + projectdetalleId)
    }
    getUrlProjectodetalle(){
        return urlBase
    }
}