<template>
	<div class="p-grid">
		<div class="p-col-12">
			<div class="card">
				<h5>Advanced</h5>
				<FileUpload name="demo[]" :url="urlBase" @upload="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000"/>

				<h5>Basic</h5>
				<FileUpload mode="basic" name="demo[]" :url="urlBase" accept="image/*" :maxFileSize="1000000" @upload="onUpload" />
			</div>
		</div>
	</div>
</template>

<script>
import ProjectsdetalleService from '../service/project/projectdetalleService'
	export default {
		data(){
			return {
				urlBase: ''
			}
		},
		created() {
			this.projectsdetalleService = new ProjectsdetalleService()
		},
		mounted(){
			//console.log(this.projectsdetalleService.getUrlProjectodetalle());
			this.urlBase = this.projectsdetalleService.getUrlProjectodetalle()
		},
		projectsdetalleService: null,
		methods: {
			onUpload() {
				console.log(this.urlBase);
				this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
			}
		}
	}
</script>

<style scoped>

</style>
