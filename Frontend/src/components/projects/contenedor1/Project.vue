<template>
	<div class="p-grid crud-demo">
		<div :class="cambiarClass">
			<div>
				<Toast/>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
					</template>

					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="projects" v-model:selection="selectedProjects" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Administrar Proyectos</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<!-- <Column field="_id" header="_id" :sortable="true"></Column> -->
					<Column field="nombreProject" header="Nombre Project" :sortable="true"></Column>
					<Column  header="Persona a cargo" :sortable="true">
                        <template #body="slotProps">
                            {{slotProps.data.nombreUser + ' ' + slotProps.data.apellidoUser}}
                        </template>
                    </Column>
                    <Column field="emailUser" header="Email" :sortable="true"></Column>
                    <Column field="imgUrlUser" header="Descripcion" :sortable="true">
                        <template #body="slotProps">
                            <img :src="slotProps.data.imgUrlUser"  class="project-image" />
                        </template>
                    </Column>
					<Column :colspan="2">
						<template #body="slotProps" >
							<Button label="Detalles" icon="pi-angle-double-right" class="p-button-rounded p-button-primary p-mr-1" @click="detalleProject(slotProps.data)" />
							<Button label="Editar" icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-1" @click="editarProject(slotProps.data)" />
							<Button label="Eliminar" icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProject(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="projectDialog" :style="{width: '450px'}" :header="cambiarHeader" :modal="true" :class="cambiarColor">	

					<!-- <img :src="'assets/layout/images/product/' + product.image" :alt="product.image" class="project-image" v-if="product.image" /> -->

                    <div class="p-field">
                        <label for="nombreProject">Nombre Project</label>
                        <InputText id="nombreProject" v-model.trim="project.nombreProject" required="true" autofocus :class="{'p-invalid': submitted && !project.nombreProject}" />
                        <small class="p-invalid" v-if="submitted && !project.nombreProject">El nombre del project es requerido.</small>
                    </div>
					<div class="p-field">
						<label for="statusCliente">Persona a cargo</label>
						<Dropdown id="useracargo" v-model="project.personacargoProject" :options="users" optionLabel="nombres" optionValue="_id" placeholder="Select One" required="true" :class="{'p-invalid': submitted && !project.personacargoProject}" v-on:change="getUser"></Dropdown>
					</div>
					<div class="p-field">
						<label for="nombres">Nombres</label>
						<InputText id="nombres" type="text" v-model.trim="user.apellidos" disabled="true"/>
					</div>
					<div class="p-col-12 p-md-2">
					<div class="card p-fluid">

							<div class="p-formgrid p-grid">
								
								<div class="p-field p-col">
									<img :src="user.imgUrl" class="project-image" />
								</div>
								
							</div>
						</div>
					</div>

					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProject" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProjectDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="project">Are you sure you want to delete <b>{{project.nombreProject}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProjectDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProject(project)" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProjectsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="project">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProjectsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProjects" />
					</template>
				</Dialog>
			</div>
		</div>
		<ProjectListaFantasma 
			:dataProjectListaFantasma="selectedProjects" 
			v-if="!(!selectedProjects || !selectedProjects.length) && existenciaProjectListaFantasma" 
		/>
	</div>

</template>

<script>
import auth from '../../../service/authenticacion/auth'
import ProjectService from '../../../service/project/projectService'
import ProjectdetalleService from '../../../service/project/projectdetalleService'
import UserService from '../../../service/user/userService'
import ProjectListaFantasma from './ProjectListaFantasma'
class Project {
  constructor( nombreProject='', personacargoProject = '') {

    this.nombreProject = nombreProject;
    this.personacargoProject = personacargoProject;
  }
}

class User{
	constructor(nombres = '', apellidos = '', email = '', imgUrl=''){
		this.nombres = nombres
		this.apellidos = apellidos
		this.email = email
		this.imgUrl = imgUrl
	}

}
export default {
	components:{
		ProjectListaFantasma
	},
	data() {
		return {
            projects: [],
            project: {},
			projectsdetalles: [],
			valores: [],
			status:null,
			estados: [
				{ value: 'Activo', text: 'Activo' },
				{ value: 'Inactivo', text: 'Inactivo' }
			],
			users: [],
			user: new User(),
			userACargo: new User(),
			projectDialog: false,//usar
			nuevo: false,
			deleteProjectDialog: false,
			deleteProjectsDialog: false,
			selectedProject: null,
			selectedProjects: null,
			filters: {},
			submitted: false,
			value3: null,
			existenciaProjectListaFantasma: false ,
		}
	},
    projectService: null,
	projectdetalleService: null,
	userService: null,
	created() {
        this.projectService = new ProjectService()
		this.projectdetalleService = new ProjectdetalleService()
		this.userService = new UserService()
	},
	mounted() {
        this.projectService.read().then(data=>this.projects = data.data);
		this.projectdetalleService.read().then(data=>this.projectsdetalles = data.data);
		this.userService.read().then(data=>this.users = data.data);
		this.Inicializar()
		
	},
	updated(){
		if (this.selectedProjects == null) {
			this.existenciaProjectListaFantasma = false
		}else if(this.selectedProjects.length == 1){
			this.existenciaProjectListaFantasma = true
		} else {
			this.existenciaProjectListaFantasma = false
		}
	},
	methods: {
		async Inicializar(){
            if (auth.getUserLogged()) {
                this.login = false
                this.register = false
                this.logged = true
                this.user = (await auth.getUser(auth.getUserLogged())).data[0]
                //console.log(this.user);
            }
        },
		getProjects(){
			this.projectService.read().then(data=>this.projects = data.data);
			//console.log(this.projects);
		},
		getUsers(){
			this.userService.read().then(data =>this.users = data.data)
		},
		getUser(){
			this.userService.readUserId(this.project.personacargoProject).then(data =>this.user = data.data)
		},
		openNew() {
			this.project = new Project();
			this.user = new User()
			this.projectDialog = true
			this.getUsers()
			this.submitted = false;
			this.nuevo = false
		},
		hideDialog() {
			this.projectDialog = false;
			this.submitted = false;
		},
		editarProject(project){
			this.project = project;
		},
		async detalleProject(project){
			this.project = project
			await this.projectdetalleService.readProjectxId(project._id).then(data=>this.projectsdetalles = data.data)
			await this.userService.readUserId(project.personacargoProject).then(data=> this.userACargo = data.data)
			this.$emit('EventProject', {data1: this.userACargo, data2: this.project, data3: this.projectsdetalles, mostrarProject: false, mostrarProjectdetalle : true})
			this.userACargo = new User()
		},
		async saveProject() {//-------------------------------------------------------------
            this.submitted = true
			const validacion =  !this.project.nombreProject == '' && 
                                !this.project.personacargoProject == ''
            if (validacion) {
                if(!this.nuevo === true) {
					this.projectDialog = false
					//console.log('estoy en if');

					this.$emit('EventProject', {data1: this.user, data2: this.project, data3: null, mostrarProject: false, mostrarProjectdetalle : true})
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});		
                }else {
					this.projectService.read().then(data =>this.projects = data.data)
                    this.getProject(this.project)

                    fetch('http://localhost:8000/v1/project/' + this.project._id, {
                    method: 'PUT',
                    body: JSON.stringify(this.project),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                    })
                    .then(res => res.json())
                    .then(() => {
                        this.getProjectes();
                        this.project = new Project();
                        this.projectDialog = false
                    });
					//console.log('estoy en else');
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
                }
            }else{
				//console.log('estoy fuera de else');
                this.projectDialog = true
            }
		},
		getProject(project) {
			this.nuevo = true
			this.projectService.readProject(project._id).then(data =>{
				const { TipoProject, nombreProject, descripcion, status, direccion } = data;
				this.project = new Project(TipoProject, nombreProject, descripcion, status, direccion );
				this.projectDialog = true
			})
		},
		async deleteProject(project) {
			this.project = project
			//console.log(this.project);
			await this.projectdetalleService.readProjectxId(project._id).then(data=>this.projectsdetalles= data.data)
			//console.log(this.projectsdetalles);
				for (let index = 0; index < this.projectsdetalles.length; index++) {
					await this.projectdetalleService.delete(this.projectsdetalles[index]._id)
				}
			await this.projectService.delete(this.project._id)
			await this.projectService.read().then(data=>this.projects = data.data)
			this.deleteProjectDialog = false
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
		},
		confirmDeleteProject(project) {
			this.project = project;
			this.deleteProjectDialog = true;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
	}, 
	computed:{
		cambiarHeader(){
			return this.nuevo ? 'Editar' : 'Nuevo'
		},
		cambiarColor(){
			return this.nuevo ? 'p-fluid' : 'p-fluid'
		},
		cambiarClass(){
			//console.log(this.selectedProjects);
			return (!(!this.selectedProjects || !this.selectedProjects.length) && this.existenciaProjectListaFantasma) ? 'p-col-6' : 'p-col-12'
		}
	}
}
</script>

<style scoped lang="scss">
.table-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.project-image {
	width: 100px;
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
