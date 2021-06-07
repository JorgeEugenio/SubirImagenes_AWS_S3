import axios from 'axios'
const { ENDPOINT_PATH } = require('../Config')
const urlBase = ENDPOINT_PATH +'project'
export default class Project{
    create(project){
        return axios.post( urlBase, project )
    }
    read(){
        return axios.get( urlBase )
    }

    update(projectId, project){
        return axios.put( urlBase + '/'+projectId, project)
    }

    delete(projectId){
        return axios.delete(urlBase + '/' + projectId)
    }
    readProject(projectId){
        return axios.get( ENDPOINT_PATH + 'projectdetalle/' + projectId)
    }
}