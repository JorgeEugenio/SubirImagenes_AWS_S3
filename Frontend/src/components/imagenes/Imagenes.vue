<template>
	<div class="p-grid">
		<div class="p-col-12">
			<div class="card">
				<h5>Advanced</h5>
				<FileUpload 
				name="imgUrl" 
				:url="urlBase" 
				@upload="onUpload" 
				:multiple="true" 
				accept="image/*" 
				:maxFileSize="10000000"/>
				
			</div>
		</div>
	</div>
</template>

<script>
//import ProjectsdetalleService from '../service/project/projectdetalleService'
import ImagenService from '../../service/imagen/imagenService'
	export default {
		data(){
			return {
				urlBase: 'http://localhost:8201/imagen'
			}
		},
		created() {
			this.imagenService = new ImagenService()
		},
		mounted(){
			//console.log(this.projectsdetalleService.getUrlProjectodetalle());
			//this.urlBase = this.imagenService.getUrlProjectodetalle()
		},
		imagenService: null,
		methods: {
			onUpload() {
				//console.log(this.urlBase);
				this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
			}
		}
	}
</script>

<style scoped>

</style>
