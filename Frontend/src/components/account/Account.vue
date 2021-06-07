<template>
	<div class="p-grid">

<!--         <div class="p-col-12">
			<div class="card">
				<h5>Account Page</h5>
				<p>Pagina en mantenimiento</p>
			</div>
		</div> -->
        <div class="p-col-12 p-md-10">
			<div class="card p-fluid">
				<h5>Vertical</h5>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
					<ToggleButton v-model="checked" onLabel="Editar" offLabel="on" onIcon="pi pi-check" offIcon="pi pi-times" style="width: 10em" :style="cambiarColorToogle"/>
					<Button label="Save" icon="pi pi-trash" class="p-button-success" @click="GuardarCambios" :disabled="checked" />
				</template>
				</Toolbar>
					<div class="p-field">
						<label for="nombres">Nombres</label>
						<InputText id="nombres" type="text" v-model.trim="user.nombres" :disabled="checked"/>
					</div>
					<div class="p-field">
						<label for="apellidos">Apellidos</label>
						<InputText id="apellidos" type="email" v-model.trim="user.apellidos" :disabled="checked"/>
					</div>
					<div class="p-field">
						<label for="email">Email</label>
						<InputText id="email" type="email" v-model.trim="user.email" :disabled="checked"/>
					</div>
			</div>
		</div>

        <div class="p-col-12 p-md-2">
			<div class="card p-fluid">
				<h5>Foto Perfil</h5>
				<div class="p-formgrid p-grid">
                    
                    <div class="p-field p-col">
						<img :src="user.imgUrl" class="product-image" />
					</div>
					
				</div>
			</div>
		</div>
	</div>
</template>

<script>
class User{
	constructor(nombres = '', apellidos = '', email = '', imgUrl=''){
		this.nombres = nombres
		this.apellidos = apellidos
		this.email = email
		this.imgUrl = imgUrl
	}

}
import auth from '../../service/authenticacion/auth'
//import userService from '../service/userService'
export default {
    props:{
    },
    data() {
        return {
            checked: true,
			user: new User()
        }
    },
	created() {
		this.Inicializar()

    },
    methods:{
		async Inicializar(){
			await this.getUserSession()
			//console.log(this.user);
		},
		async getUserSession(){
			if (auth.getUserLogged()) {
                this.user = (await auth.getUser(auth.getUserLogged())).data[0]
            }
		},
        onUpload() {
			this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
		},
		async GuardarCambios(){
			//console.log(this.user);
			//userService.saveUser(this.user)
			await this.getUserSession()
			this.checked = true
		}
    },
    computed:{
        imagen(){
            return this.checked ? 'p-field p-col-12 p-md-1': ''
        },
		cambiarColorToogle(){
			return this.checked ? 'p-button-primary' :'p-button-success'
		}
    }

}
</script>

<style scoped>
.product-image {
	width: 208px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>
