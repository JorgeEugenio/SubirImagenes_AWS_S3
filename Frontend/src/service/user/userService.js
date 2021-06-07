import axios from 'axios'
const { ENDPOINT_PATH } = require('../Config')
const urlBase = ENDPOINT_PATH +'user'
export default class Project{
    create(project){
        return axios.create( urlBase, project )
    }
    read(){
        return axios.get( urlBase )
    }

    update(userId, project){
        return axios.put( urlBase + '/'+userId, project)
    }

    delete(userId){
        return axios.delete(urlBase + '/' + userId)
    }

    readUserId(userId){
        //console.log(ENDPOINT_PATH + 'userid/' + userId);
        return axios.get( ENDPOINT_PATH + 'userid/' + userId)
    }

}