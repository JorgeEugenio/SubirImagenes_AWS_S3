<template>
	<div class="p-grid crud-demo">
		<div class="p-col-6 p-md-6">
					<h1><strong>{{dataProject.nombreProject}}</strong></h1>
				</div>
		<div class="p-col-12">
			<Toolbar class="p-mb-4">
					<template v-slot:left>
						<label for="texto"><p><strong>Persona a cargo</strong></p></label>
					</template>
				</Toolbar>
            <div class="p-grid p-fluid">
                <div class="p-col-3 p-md-3">
                    <div class="p-field">
                        <label for="cliente.codigoCliente" style="text-align:center">Nombres</label>
                        <InputText disabled="true" :value="dataUser.nombres" style="text-align:center" />
                    </div>
                </div>
                <div class="p-col-4 p-md-4">
                    <div class="p-field">
                        <label for="cliente.nombreCliente" style="text-align:center" >Apellidos</label>
                        <InputText disabled="true" :value="dataUser.apellidos" style="text-align:center" />
                    </div>
                </div>
                <div class="p-col-4 p-md-4">
                    <div class="p-field">
                        <label for="cliente.apellidoCliente" style="text-align:center">Email</label>
                        <InputText disabled="true" :value="dataUser.email" style="text-align:center" />
                    </div>
                </div>
                <div class="p-col-1 p-md-1">
                    <div class="p-field">
                        <label for="cliente.dniCliente" style="text-align:center">Avatar</label>
						<div class="p-field">
							<img :src="dataUser.imgUrl" class="projectdetalle-image" >
						</div>
                    </div>
                </div>
            </div>
		</div>
		<div class="p-grid crud-demo" v-if="muestraListaProjectsdetalles">
			<div class="p-col-12">
				<div>
					<Toast/>
					<Toolbar class="p-mb-4">
						<template v-slot:left >
							<h5><strong>Detalles del proyecto : </strong><strong></strong></h5>
						</template>
					</Toolbar>
					<Listaprojectsdetalle  
						:dataUser="dataUser"
						:dataProject="dataProject"
						:dataProjectdetalle="dataProjectdetalle"
					/>   
					
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import Listaprojectsdetalle from '../contenedor2/Listaprojectsdetalle.vue'
import UserService from '../../../service/user/userService'
export default {
	components:{
		Listaprojectsdetalle
	},
	props:{
		dataProject: Object,
		dataProjectdetalle: Object,
		dataUser: Object
	},
	data() {
		return {
			muestraListaClientes: false,
			muestraListaProjectsdetalles: true,
		}

	},
	userService: null,
	created(){
		this.userService = new UserService()
		/* console.log(this.dataUser);
		console.log(this.dataProject);
		console.log(this.dataProjectdetalle); */
	},
	mounted(){
		//console.log(this.dataProjectDetalle.personaCargoProject);
		//this.userService.readUserId(this.dataProjectDetalle.personaCargoProject).then((data)=>console.log(data.data))
	},
	updated(){

	},
	methods:{

	},
	computed:{
		cambiarLabelListaClientes(){
            return !this.muestraListaClientes ? 'Nuevo' : 'Cancelar'
        },
		cambiarEstiloListaClientes(){
            return !this.muestraListaClientes ? 'p-button-success p-mr-2' : 'p-button-secondary p-mr-2'
        },

	}

}
</script>

<style scoped lang="scss">
.table-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.projectdetalle-image {
	width: 38px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .project-image {
	width: 150px;
	margin: 0 auto 2rem auto;
	display: block;
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.project-badge {
	border-radius: 2px;
	padding: .25em .5rem;
	text-transform: uppercase;
	font-weight: 700;
	font-size: 12px;
	letter-spacing: .3px;

	&.status-instock {
		background: #C8E6C9;
		color: #256029;
	}

	&.status-outofstock {
		background: #FFCDD2;
		color: #C63737;
	}

	&.status-lowstock {
		background: #FEEDAF;
		color: #8A5340;
	}
}
</style>
