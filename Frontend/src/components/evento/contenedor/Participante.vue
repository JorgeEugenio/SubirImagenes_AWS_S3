<template>
	
		<div class="p-col-12">
			<div>
				<Toast/>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="Nuevo participante" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
					</template>

					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="participantes" v-model:selection="selectedParticipantes" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Administrar Participantes</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<!-- <Column field="_id" header="_id" :sortable="true"></Column> -->
					<Column field="nombresparticipante" header="nombres" :sortable="true"></Column>
                    <Column field="detallesparticipante" header="detalle" :sortable="true"></Column>
                    <Column field="costoinscripcionparticipante" header="inscripcion" :sortable="true"></Column>
					<Column :colspan="1">
						<template #body="slotProps" >
							<Button label="Editar" icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-1" @click="editarParticipante(slotProps.data)" />
							<Button label="Eliminar" icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteParticipante(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="participanteDialog" :style="{width: '450px'}" :header="cambiarHeader" :modal="true" :class="cambiarColor">	

					<!-- <img :src="'assets/layout/images/product/' + product.image" :alt="product.image" class="participante-image" v-if="product.image" /> -->
					<div class="p-field">
                        <label for="nombresparticipante">Nombres</label>
                        <InputText id="nombresparticipante" v-model.trim="participante.nombresparticipante" required="true" autofocus :class="{'p-invalid': submitted && !participante.nombresparticipante}" />
                        <small class="p-invalid" v-if="submitted && !participante.nombresparticipante">El nombre del participante es requerido.</small>
                    </div>
					<div class="p-field">
                        <label for="detallesparticipante">Detalles</label>
                        <InputText id="detallesparticipante" v-model.trim="participante.detallesparticipante" required="true" autofocus :class="{'p-invalid': submitted && !participante.detallesparticipante}" />
                        <small class="p-invalid" v-if="submitted && !participante.detallesparticipante">El nombre del participante es requerido.</small>
                    </div>
					<div class="p-field">
                        <label for="costoinscripcionparticipante">Inscripcion</label>
                        <InputNumber id="costoinscripcionparticipante" v-model="participante.costoinscripcionparticipante" required="true" autofocus :class="{'p-invalid': submitted && !participante.costoinscripcionparticipante}" />
                        <small class="p-invalid" v-if="submitted && !participante.costoinscripcionparticipante">El nombre del participante es requerido.</small>
                    </div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Continuar" icon="pi pi-check" class="p-button-text" @click="saveParticipante" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteParticipanteDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="participante">Are you sure you want to delete <b>{{participante.nombreParticipante}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteParticipanteDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteParticipante(participante)" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteParticipantesDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="participante">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteParticipantesDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedParticipantes" />
					</template>
				</Dialog>
			</div>
		</div>
</template>

<script>
import ParticipanteService from '../../../service/participante/participanteService'
class Participante{
	constructor(idEventoparticipante = '', nombresparticipante = '', detallesparticipante = '', costoinscripcionparticipante= 0){
		this.idEventoparticipante = idEventoparticipante
		this.nombresparticipante = nombresparticipante
		this.detallesparticipante = detallesparticipante
		this.costoinscripcionparticipante = costoinscripcionparticipante
	}
}

export default {
	components:{
	},
    props:{
        dataEvento: Object
    },
	data() {
		return {
            participantes: [],
            participante: {},
			participantesdetalles: [],
			status:null,
			estados: [
				{ value: 'Activo', text: 'Activo' },
				{ value: 'Inactivo', text: 'Inactivo' }
			],
			participanteDialog: false,//usar
			nuevo: false,
			deleteParticipanteDialog: false,
			deleteParticipantesDialog: false,
			selectedParticipante: null,
			selectedParticipantes: null,
			filters: {},
			submitted: false,
			existenciaSeleccion: false ,
		}
	},
	participanteService: null,
	created() {
        this.participanteService = new ParticipanteService()
	},
	async mounted() {
        await this.participanteService.filtroIdEvento(this.dataEvento[0]._id).then(data =>this.participantes = data.data )
	},
	updated(){
		if (this.selectedParticipantes == null) {
			this.existenciaSeleccion = false
		}else if(this.selectedParticipantes.length == 1){
			this.existenciaSeleccion = true
		} else {
			this.existenciaSeleccion = false
		}
	},
	methods: {

		openNew() {
			this.participante = new Participante();
			this.participanteDialog = true
			this.submitted = false;
			this.nuevo = true
		},
		hideDialog() {
			this.participanteDialog = false;
			this.submitted = false;
		},
		editarParticipante(participante){
			this.participanteDialog = true
			this.participante = participante
			this.nuevo = false
		},
		async detalleParticipante(participante){
			this.participante = participante
			await this.participanteService.readParticipantexId(participante._id).then(data=>this.participantesdetalles = data.data)
			this.$emit('EventParticipante', {data1: this.userACargo, data2: this.participante, data3: this.participantesdetalles, mostrarParticipante: false, mostrarParticipantedetalle : true})
		},
		async saveParticipante() {//-------------------------------------------------------------
			this.participante.idEventoparticipante = this.dataEvento[0]._id
			//console.log(this.participante);
            this.submitted = true
			const validacion =  !this.participante.nombresparticipante == '' && 
                                !this.participante.detallesparticipante == '' &&
								!this.participante.costoinscripcionparticipante == ''

            if (validacion) {
                if(this.nuevo === true) {
					this.participanteDialog = false
					console.log('estoy en if');
					//console.log(this.participante);
					await this.participanteService.create(this.participante).then(data=>console.log(data.data))
					await this.participanteService.filtroIdEvento(this.dataEvento[0]._id).then(data =>this.participantes = data.data )
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});		
                }else {
					await this.participanteService.update(this.participante._id, this.participante).then(data => console.log(data.data))
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
					this.participanteDialog = false
                }
            }else{
				//console.log('estoy fuera de else');
                this.participanteDialog = true
            }
		},
		getParticipante(participante) {
			this.nuevo = true
			this.participanteService.readParticipante(participante._id).then(data =>{
				const { TipoParticipante, nombreParticipante, descripcion, status, direccion } = data;
				this.participante = new Participante(TipoParticipante, nombreParticipante, descripcion, status, direccion );
				this.participanteDialog = true
			})
		},
		async deleteParticipante(participante) {
			this.participante = participante
			await this.participanteService.delete(participante._id).then(data=>console.log(data.data))
			await this.participanteService.filtroIdEvento(this.dataEvento[0]._id).then(data =>this.participantes = data.data )
			this.deleteParticipanteDialog = false
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
		},
		confirmDeleteParticipante(participante) {
			this.participante = participante;
			this.deleteParticipanteDialog = true;
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
			//console.log(this.selectedParticipantes);
			return (!(!this.selectedParticipantes || !this.selectedParticipantes.length) && this.existenciaSeleccion) ? 'p-col-6' : 'p-col-12'
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

.participante-image {
	width: 100px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .participante-image {
	width: 150px;
	margin: 0 auto 2rem auto;
	display: block;
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.participante-badge {
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
