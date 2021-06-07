<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div>
				<Toast/>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="Nuevo evento" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
					</template>

					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="eventos" v-model:selection="selectedEventos" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Administrar Eventos</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<!-- <Column field="_id" header="_id" :sortable="true"></Column> -->
					<Column field="fechaevento" header="Fecha de evento" :sortable="true"></Column>
					<Column field="detalleevento" header="Detalle" :sortable="true"></Column>
                    <Column field="ingresoevento" header="Ingresos" :sortable="true"></Column>
                    <Column field="egresoevento" header="Egresos" :sortable="true"></Column>
					<Column :colspan="1">
						<template #body="slotProps" >
							<Button label="Detalles" icon="pi-angle-double-right" class="p-button-rounded p-button-primary p-mr-1" @click="detalleEvento(slotProps.data)" />
							<Button label="Editar" icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-1" @click="editarEvento(slotProps.data)" />
							<Button label="Eliminar" icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteEvento(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="eventoDialog" :style="{width: '450px'}" :header="cambiarHeader" :modal="true" :class="cambiarColor">	

					<!-- <img :src="'assets/layout/images/product/' + product.image" :alt="product.image" class="evento-image" v-if="product.image" /> -->
					<div class="p-field">
						<label for="nombres">Fecha</label>
						<Calendar id="dateformat" v-model="evento.fechaevento"  dateFormat="mm-dd-yy" />
					</div>
					<div class="p-field">
                        <label for="detalleevento">Nombre Evento</label>
                        <InputText id="detalleevento" v-model.trim="evento.detalleevento" required="true" autofocus :class="{'p-invalid': submitted && !evento.detalleevento}" />
                        <small class="p-invalid" v-if="submitted && !evento.detalleevento">El nombre del evento es requerido.</small>
                    </div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Continuar" icon="pi pi-check" class="p-button-text" @click="saveEvento" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteEventoDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="evento">Are you sure you want to delete <b>{{evento.nombreEvento}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteEventoDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteEvento(evento)" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteEventosDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="evento">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteEventosDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedEventos" />
					</template>
				</Dialog>
			</div>
		</div>
		<Eventodetallecomponent v-if="existenciaSeleccion" :dataEvento="dataEvento"/>
		<Participantecomponent v-if="existenciaSeleccion" :dataEvento="dataEvento" />
	</div>

</template>

<script>
import auth from '../../service/authenticacion/auth'
import EventoService from '../../service/evento/eventoService'
import EventodetalleService from '../../service/evento/eventodetalleService'

import Eventodetallecomponent from './contenedor/Eventodetalle'
import Participantecomponent from './contenedor/Participante'

class Evento{
	constructor(fechaevento = '', detalleevento = '', egresoevento = '', ingresoevento=''){
		this.fechaevento = fechaevento
		this.detalleevento = detalleevento
		this.egresoevento = egresoevento
		this.ingresoevento = ingresoevento
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
		Eventodetallecomponent,
		Participantecomponent
	},
	data() {
		return {
            eventos: [],
            evento: {},
			eventosdetalles: [],
			status:null,
			estados: [
				{ value: 'Activo', text: 'Activo' },
				{ value: 'Inactivo', text: 'Inactivo' }
			],
			eventoDialog: false,//usar
			nuevo: false,
			deleteEventoDialog: false,
			deleteEventosDialog: false,
			selectedEvento: null,
			selectedEventos: null,
			filters: {},
			submitted: false,
			existenciaSeleccion: false ,
			dataEvento: null
		}
	},
	eventodetalleService: null,
	eventoService: null,
	created() {
        this.eventoService = new EventoService()
		this.eventodetalleService = new EventodetalleService()

	},
	mounted() {
		this.eventoService.read().then(data=>this.eventos = data.data)
		this.Inicializar()
		
	},
	updated(){
		if (this.selectedEventos == null) {
			this.existenciaSeleccion = false
		}else if(this.selectedEventos.length == 1){
			this.existenciaSeleccion = true
			this.dataEvento = this.selectedEventos
			
		} else {
			this.existenciaSeleccion = false
		}
	},
	methods: {
		async Inicializar(){
            if (auth.getUserLogged()) {
                this.login = false
                this.register = false
                this.logged = true
                this.user = (await auth.getUser(auth.getUserLogged())).data[0]
            }
        },
		getUser(){
			this.userService.readUserId(this.evento.personacargoEvento).then(data =>this.user = data.data)
		},
		openNew() {
			this.evento = new Evento();
			this.eventoDialog = true
			this.submitted = false;
			this.nuevo = false
		},
		hideDialog() {
			this.eventoDialog = false;
			this.submitted = false;
		},
		editarEvento(evento){
			this.eventoDialog = true
			this.evento = evento
		},
		async detalleEvento(evento){
			this.evento = evento
			await this.eventodetalleService.readEventoxId(evento._id).then(data=>this.eventosdetalles = data.data)
			await this.userService.readUserId(evento.personacargoEvento).then(data=> this.userACargo = data.data)
			this.$emit('EventEvento', {data1: this.userACargo, data2: this.evento, data3: this.eventosdetalles, mostrarEvento: false, mostrarEventodetalle : true})
			this.userACargo = new User()
		},
		async saveEvento() {//-------------------------------------------------------------
            this.submitted = true
			const validacion =  !this.evento.fechaevento == '' && 
                                !this.evento.detalleevento == ''
            if (validacion) {
                if(!this.nuevo === true) {
					this.eventoDialog = false
					//console.log('estoy en if');
					this.$emit('EventEvento', {data1: this.user, data2: this.evento, data3: null, mostrarEvento: false, mostrarEventodetalle : true})
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});		
                }else {
					this.eventoService.read().then(data =>this.eventos = data.data)
                    this.getEvento(this.evento)

                    fetch('http://localhost:8000/v1/evento/' + this.evento._id, {
                    method: 'PUT',
                    body: JSON.stringify(this.evento),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                    })
                    .then(res => res.json())
                    .then(() => {
                        this.getEventoes();
                        this.evento = new Evento();
                        this.eventoDialog = false
                    });
					//console.log('estoy en else');
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
                }
            }else{
				//console.log('estoy fuera de else');
                this.eventoDialog = true
            }
		},
		getEvento(evento) {
			this.nuevo = true
			this.eventoService.readEvento(evento._id).then(data =>{
				const { TipoEvento, nombreEvento, descripcion, status, direccion } = data;
				this.evento = new Evento(TipoEvento, nombreEvento, descripcion, status, direccion );
				this.eventoDialog = true
			})
		},
		async deleteEvento(evento) {
			this.evento = evento
			//console.log(this.evento);
			await this.eventodetalleService.readEventoxId(evento._id).then(data=>this.eventosdetalles= data.data)
			//console.log(this.eventosdetalles);
				for (let index = 0; index < this.eventosdetalles.length; index++) {
					await this.eventodetalleService.delete(this.eventosdetalles[index]._id)
				}
			await this.eventoService.delete(this.evento._id)
			await this.eventoService.read().then(data=>this.eventos = data.data)
			this.deleteEventoDialog = false
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
		},
		confirmDeleteEvento(evento) {
			this.evento = evento;
			this.deleteEventoDialog = true;
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
			//console.log(this.selectedEventos);
			return (!(!this.selectedEventos || !this.selectedEventos.length) && this.existenciaSeleccion) ? 'p-col-6' : 'p-col-12'
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

.evento-image {
	width: 100px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .evento-image {
	width: 150px;
	margin: 0 auto 2rem auto;
	display: block;
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.evento-badge {
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
