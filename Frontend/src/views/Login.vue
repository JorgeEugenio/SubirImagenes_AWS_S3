<template>
    <div class="login">
        <h1 class="title">Login in the page</h1>
        <form action class="form" @submit.prevent="login">
        <label class="form-label" for="#email">Email:</label>
        <input
            v-model="usuario.email"
            class="form-input"
            type="email"
            id="email"
            required
            placeholder="Email"
        >
        <label class="form-label" for="#password">Password:</label>
        <input
            v-model="usuario.password"
            class="form-input"
            type="password"
            id="password"
            placeholder="Password"
        >
        <p v-if="error" class="error">Has introducido mal el email o la contraseña.</p>
        <input class="form-submit" type="submit" value="Login">
        </form>
        <div class="msg">
            <Button label="No tienes cuenta? Regístrate" class="p-button-info p-button-text p-mr-2 p-mb-2" v-on:click="IrARegister" />
        </div>
    </div>
</template>

<script>
import auth from '../service/authenticacion/auth'
class Usuario{
    constructor(nombres = '', apellidos = '', email = '', password = ''){
        this.nombres = nombres,
        this.apellidos = apellidos,
        this.email = email,
        this.password = password
    }
}
export default {
  data: () => ({
    usuario : new Usuario(),
    error: false
  }),
  created(){
    this.usuario = new Usuario()
    this.$router.push("/");
  },
  methods: {
    async login() {
      try {
          await auth.login(this.usuario.email, this.usuario.password)
            .then((data)=> {
                this.usuario = data.data
                if (!this.usuario[0]) {
                    this.error = true
                }else{
                    this.$emit('estadoLogin', {login: false, register: false, logged: true, user: this.usuario[0]})
                    this.$router.push("/");
                }
            })
      } catch (e) {
          console.log(e);
      }
    },
    IrARegister(){
        this.$emit('estadoRegister', {login: false, register: true, logged: false})
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  padding: 2rem;
}
.title {
  text-align: center;
}
.form {
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 350px;
  max-width: 100%;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
.form-label {
  margin-top: 2rem;
  color: white;
  margin-bottom: 0.5rem;
  &:first-of-type {
    margin-top: 0rem;
  }
}
.form-input {
  padding: 10px 15px;
  background: none;
  background-image: none;
  border: 1px solid white;
  color: white;
  &:focus {
    outline: 0;
    border-color: #1ab188;
  }
}
.form-submit {
  background: #1ab188;
  border: none;
  color: white;
  margin-top: 3rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #0b9185;
  }
}
.error {
  margin: 1rem 0 0;
  color: #ff4a96;
}
.msg {
  text-align: center;
  vertical-align: middle;
}
</style>