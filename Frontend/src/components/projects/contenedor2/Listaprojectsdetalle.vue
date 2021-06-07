<template>
    <div class="p-grid crud-demo">
		<div class="p-col-12">
			<div>
				<Toast/>
                <Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProjectdetalles || !selectedProjectdetalles.length" />
					</template>
				</Toolbar>
				<DataTable ref="dt" :value="projectdetalles" v-model:selection="selectedProjectdetalles" dataKey="_id" :paginator="true" :rows="20" :filters="filters"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[23,24,48]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
					<template #header>
						<div class="table-header">
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>
					<Column field="_id" header="codigo Projecto" :sortable="true">
                        <template #body="slotProps">
                            {{formatoCodigo(slotProps.data._id)}}
                        </template>
                    </Column>
                    <Column field="detalle_fechaAvance" header="Presentación" :sortable="true"></Column>
                    <Column field="detalle_projectDetalleName" header="Name" :sortable="true"></Column>
					<Column field="detalle_urlRecurso" header="Tipo recurso" :sortable="true">
                        <template #body="slotProps">
                            <div class="table-header">
                                <a :href="slotProps.data.detalle_urlRecurso">{{slotProps.data.detalle_tipoRecurso}}</a>
                            </div>
                        </template>
                    </Column>
                    <Column field="detalle_createdAt" header="Created" :sortable="true" >
                        <template #body="slotProps">
                            {{formatoFecha(slotProps.data.detalle_createdAt)}}
                        </template>
                    </Column>
                    <Column field="detalle_updatedAt" header="Updated" :sortable="true">
                        <template #body="slotProps">
                            {{formatoFecha(slotProps.data.detalle_updatedAt)}}
                        </template>
                    </Column>
					<Column>
						<template #body="slotProps">
							<Button label="Detalles" icon="pi pi-bars" class="p-button-rounded p-button-success p-mr-2" @click="editBoletaDetalle(slotProps.data)" />
							<Button label="Eliminar" icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProject(slotProps.data)" />
						</template>
					</Column>
				</DataTable>
                <Dialog v-model:visible="projectdetalleDialog" :style="{width: '450px'}" header="Project detail" :modal="true" class="p-fluid">
					<div class="p-field">
						<label for="idProject">Nombre</label>
						<InputText id="projectDetalleName" v-model.trim="projectdetalle.projectDetalleName" required="true" autofocus :class="{'p-invalid': submitted && !projectdetalle.projectDetalleName}" />
						<small class="p-invalid" v-if="submitted && !projectdetalle.projectDetalleName">Name is required.</small>
					</div>
					<div class="p-field">
						<label for="fechaAvance">Fecha avance</label>
						<Calendar id="dateformat" v-model="projectdetalle.fechaAvance"  dateFormat="dd-mm-yy" :class="{'p-invalid': submitted && !projectdetalle.fechaAvance}" />
					</div>
					<div class="p-field">
						<label for="tipoRecurso">Tipo recurso</label>
						<InputText id="tipoRecurso" v-model="projectdetalle.tipoRecurso" :class="{'p-invalid': submitted && !projectdetalle.tipoRecurso}" />
					</div>
					<div class="p-field">
						<FileUpload 
						name="image" 
						:url="urlProject" 
						chooseLabel="Escoja"
						:showUploadButton="activar"
						:showCancelButton="activar"
						accept="image/*" 
						:maxFileSize="1000000"
						@upload="onUpload"
						:multiple="true" 
						:dataFile="datafile"
					
						>
							<template #empty>
								<p>Drag and drop files to here to upload.</p>
							</template>
						</FileUpload>
						<Button v-on:click="onUpload">cambio</Button>
					</div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProjectdetalle" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProjectdetalleDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="projectdetalle">Are you sure you want to delete <b>{{projectdetalle.detalle_projectDetalleName}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProjectdetalleDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProjectdetalle" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProjectdetallesDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
					</template>
				</Dialog>
            </div>
        </div>
    </div>
</template>

<script>
import ProjectService from '../../../service/project/projectService'
import ProjectsdetalleService from '../../../service/project/projectdetalleService'
class Projectdetalle{
	constructor( idProject = '', projectDetalleName = '', fechaAvance = null, tipoRecurso = ''){
		this.idProject = idProject
		this.projectDetalleName = projectDetalleName
		this.fechaAvance = fechaAvance
		this.tipoRecurso = tipoRecurso
	}
}
export default {
    components:{
    },
    props:{
        dataProject: Object,
		dataProjectdetalle: Object,
		dataUser: Object
    },
    data() {
        return {
            filters: {},
            projectdetalleDialog: false,
            deleteProjectdetalleDialog: false,
            deleteProjectdetallesDialog: false,
            selectedProjectdetalles: null,
			projectdetalle: new Projectdetalle(),
			product: {},
			submitted: false,
			value: null,
			validacion: null,
			projectIdTemporal: '',
			projectdetalles: {},
			image: '',
			activar:false,
			file: null,
			datafile: {'name': 'valor1'}


        }

    },
	projectdetalleService: null,
	projectService: null,
    created(){
		this.projectdetalleService = new ProjectsdetalleService()
		this.projectService = new ProjectService()
		if (!this.dataProjectdetalle) {
			this.projectdetalles =  null
		}else{
			this.projectdetalles =  this.dataProjectdetalle
		}
    },
    mounted(){
		this.urlProject = this.projectdetalleService.getUrlProjectodetalle()
		//console.log(this.urlProject);
    },
    updated(){
    },
    methods:{
		onUpload(){
			//console.log(e);
			//console.log(this.activar);
			this.activar = !this.activar
            this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
        },
		formatoFecha(valor){
			if (!valor) {
				return null
			}else{
				return valor.substr(0,10)+'\n'+valor.substr(12,4)
			}
        },
        formatoCodigo(valor){
            return parseInt(valor.substr(18,6),16)
        },
        openNew(){
            this.projectdetalleDialog = true
			this.submitted = false
			this.projectdetalle = new Projectdetalle()

        },
		hideDialog(){
			this.projectdetalleDialog = false
			this.projectdetalle = new Projectdetalle()
		},
		async saveProjectdetalle(){
			this.submitted = true
			const validacion = (
				!this.projectdetalle.projectDetalleName != '' &&
				!this.projectdetalle.fechaAvance != '' &&
				!this.projectdetalle.tipoRecurso != '' 
				)

			if (!validacion) {

				if (!this.projectdetalles) {
					console.log('estoy en if');
					await this.projectService.create(this.dataProject).then((data)=>this.projectIdTemporal = data.data)
					this.projectdetalle.idProject = this.projectIdTemporal
					console.log(this.projectdetalle);
					console.log(this.file);
					await this.projectdetalleService.create(this.file, this.projectdetalle)
					await this.projectdetalleService.readProjectxId(this.projectIdTemporal).then(data=>this.projectdetalles = data.data)
					this.activar = !this.activar
				}else if(!this.projectIdTemporal){
					console.log('estoy en elseif');
					//console.log(this.projectdetalles);
					console.log(this.file);
					this.projectdetalle.idProject = this.dataProject._id
					await this.projectdetalleService.create(this.projectdetalle)
					await this.projectdetalleService.readProjectxId(this.projectdetalle.idProject).then(data=>this.projectdetalles = data.data)
					this.activar = true
				}else{
					console.log('estoy en else');
					this.projectdetalle.idProject = this.projectIdTemporal
					await this.projectdetalleService.create(this.projectdetalle)
					await this.projectdetalleService.readProjectxId(this.projectIdTemporal).then(data=>this.projectdetalles = data.data)
				}
				this.projectdetalleDialog = false;
				this.activar = false
				
			}else{
				console.log('estoy en else');				
			}
		},
		confirmDeleteProject(projectdetalle){
			this.deleteProjectdetalleDialog = true
			this.projectdetalle = projectdetalle
			//console.log(projectdetalle);
		},
        confirmDeleteSelected() {
			this.deleteProductsDialog = true;
		},
		async deleteProjectdetalle() {
			this.deleteProjectdetalleDialog = false;
			await this.projectdetalleService.delete(this.projectdetalle._id)
			await this.projectdetalleService.readProjectxId(this.dataProject._id).then(data=>this.projectdetalles = data.data)					
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Project detalle Deleted', life: 3000});
		},
		deleteSelectedProducts() {
			this.products = this.products.filter(val => !this.selectedProjectsdetalle.includes(val));
			this.deleteProjectdetalleDialog = false;
			this.selectedProjectsdetalle = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
		}
    },
    computed:{

    }

}
</script>

<style scoped>

</style>