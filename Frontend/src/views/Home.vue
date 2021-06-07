<template>
    <div>
        <h1>Bienvenidos a home</h1>

<!--         <Login v-if="!logged" v-on:logged="cambiarLogged"/>
        <App v-if="logged" /> -->
    </div>
</template>
<script>

/* import App from '../App'
import Login from './Login' */
export default {
    name:'Home',
    components: {
 /*        'App': App,
        'Login': Login */
    },
    data() {
        return {
            //logged: false
        }
    },
    methods: {
/*         cambiarLogged(valor){
            console.log(valor);
            this.logged = valor
        } */
    }
}
</script>
<style>

</style>

