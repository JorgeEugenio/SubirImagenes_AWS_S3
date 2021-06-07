import axios from "axios";
import Cookies from "js-cookie";

const { ENDPOINT_PATH } = require('../Config')

export default {
  register(nombres, apellidos, email, password) {
    const user = { nombres, apellidos, email, password };
    return axios.post(ENDPOINT_PATH + "user", user);
  },
  login( email, password){
      const user = { email, password };
      return axios.get(ENDPOINT_PATH+'user/'+ user.email + '/' + user.password)
  },
  getUser(email){
    return axios.get(ENDPOINT_PATH + 'user/'+ email )
  },
  setUserLogged(email) {
    Cookies.set("userLogged", email);
  },
  getUserLogged() {
    return Cookies.get("userLogged");
  },
  deleteUserLogged() {
    Cookies.remove('userLogged');
  }
    };