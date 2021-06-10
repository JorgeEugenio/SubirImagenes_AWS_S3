<template>
	<div class="p-grid">
		<!-- <div class="p-col-6">
			<div class="card p-fluid">
				<h5>Vertical</h5>
				<div class="p-field">
					<label for="name1">Name</label>
					<InputText id="name1" type="text" />
				</div>
				<div class="p-field">
					<label for="email1">Email</label>
					<InputText id="email1" type="text" />
				</div>
				<div class="p-field">
					<label for="age1">Age</label>
					<InputText id="age1" type="text" />
				</div>
			</div>
		</div> -->
		<div class="p-col-6">
			<div class="card p-fluid">
				<Toast/>
				<div class="p-field">
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
		<div class="p-col-12">
			<DataTable ref="dt" :value="imagenes" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
					<template #header>
						<div class="table-header p-d-flex p-flex-column p-flex-md-row p-jc-md-between">
							<h5 class="p-m-0">Manage Products</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<Column header="Image">
						<template #body="slotProps">
							<span class="p-column-title">Image</span>
							<img :src="'http://' + slotProps.data.imgUrl" :alt="slotProps.data.image" class="imagenes-image" />
						</template>
					</Column>
			</DataTable>

		</div>
	</div>
</template>

<script>
//import ProjectsdetalleService from '../service/project/projectdetalleService'
import ImagenService from '../../service/imagen/imagenService'
	export default {
		data(){
			return {
				urlBase: 'http://localhost:8201/imagen',
				submitted: false,
				user: {nombreUser: null, },
				array: ["HTML","CSS"],
				imagenes:[],
				selectedProducts: null,
				filters: {},
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
				this.imagenService.read().then(data=>this.imagenes = data.data)
				console.log(this.imagenes);
			}
		}
	}
</script>

<style scoped>
.imagenes-image {
		width: 200px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	}
.p-dialog .imagenes-image {
		width: 150px;
		margin: 0 auto 2rem auto;
		display: block;
	}
</style>
