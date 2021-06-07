<template>
	<div class="p-grid">
		<div class="p-col-12">
			<div class="card">
				<Button 
					@click="CambiarEstadoProjectbienvenido" 
					label="Inicio" 
					:class="CambiarEstiloBotonProjectbienvenido"
				/>
					
				<Button 
					@click="CambiarEstadoProject" 
					label="Project" 
					:class="CambiarEstiloBotonProject"
				/>
				<Button 
					@click="CambiarEstadoProjectdetalle" 
					label="Detalles" 
					:class="CambiarEstiloBotonProjectdetalle"
					:disabled="!estadoProjectdetalle"
				/>
				<Button 
					@click="CambiarEstadoPrueba" 
					label="Prueba" 
					:class="CambiarEstiloBotonPrueba"
				/>


				<div class="card">
					<Projectbienvenido v-if="estadoProjectbienvenido"/>
				</div>
				<div class="card" v-if="estadoProject">
					<Project  @EventProject="unpackproject"/>
				</div>
				<div class="card" v-if="estadoProjectdetalle">
					<Projectdetalle :dataUser="dataUser" :dataProject="dataProject" :dataProjectdetalle="dataProjectdetalle" />
				</div>
				<div class="card" v-if="estadoPrueba">
					<Prueba />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Projectbienvenido from './Projectbienvenido'
import Project from './Project'
import Projectdetalle from './Projectdetalle'
import Prueba from './Prueba'
export default {
	components:{
		Projectbienvenido,
		Project,
		Projectdetalle,
		Prueba
	},
	props:{

	},
	data() {
		return {
			estadoProjectbienvenido: true,
			estadoProject: false,
			estadoProjectdetalle: false,
			dataProject: {},
			dataProjectdetalle: {},
			dataUser:{},
			estadoPrueba: false
			
		}

	},
	created(){

	},
	mounted(){

	},
	updated(){
		
	},
	methods:{
		CambiarEstadoProjectbienvenido(){
			this.estadoProjectbienvenido = true
			this.estadoProject = false
			this.estadoProjectdetalle = false
			this.estadoPrueba = false
		},
		CambiarEstadoProject(){
			this.estadoProjectbienvenido = false
			this.estadoProject = true
			this.estadoProjectdetalle = false
			this.estadoPrueba = false
		},
		CambiarEstadoProjectdetalle(){
			this.estadoProjectbienvenido = false
			this.estadoProject = false
			this.estadoProjectdetalle = true
			this.estadoPrueba = false
		},
		CambiarEstadoPrueba(){
			this.estadoProjectbienvenido = false
			this.estadoProject = false
			this.estadoProjectdetalle = false
			this.estadoPrueba = true
		},
		unpackproject(valor){
			this.estadoProject = valor.mostrarProject
			this.estadoProjectdetalle = valor.mostrarProjectdetalle
			this.dataUser = valor.data1
			this.dataProject = valor.data2
			this.dataProjectdetalle = valor.data3
			//console.log(valor.data3);
		}
	},
	computed:{
		CambiarEstiloBotonProjectbienvenido(){
            return this.estadoProjectbienvenido ? 'p-button-secondary p-mr-2 p-mb-2' :'p-button-outlined p-button-info p-mr-2 p-mb-2'
        },
		CambiarEstiloBotonProject(){
            return this.estadoProject ? 'p-button-secondary p-mr-2 p-mb-2' :'p-button-outlined p-button-info p-mr-2 p-mb-2'
        },
		CambiarEstiloBotonProjectdetalle(){
            return this.estadoProjectdetalle ? 'p-button-secondary p-mr-2 p-mb-2' :'p-button-outlined p-button-info p-mr-2 p-mb-2'
        },
		CambiarEstiloBotonPrueba(){
            return this.estadoPrueba ? 'p-button-secondary p-mr-2 p-mb-2' :'p-button-outlined p-button-info p-mr-2 p-mb-2'
        },
		

	}

}
</script>

<style scoped>

</style>
