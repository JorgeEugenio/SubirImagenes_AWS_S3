<template>
	
		<div class="p-col-12">
			<div>
				<Toast/>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="Nuevo detalle eventodetalle" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
					</template>

					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="eventodetalledetalles" v-model:selection="selectedEventodetalles" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Administrar Eventodetalles</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<!-- <Column field="_id" header="_id" :sortable="true"></Column> -->
					<Column field="idEvento" header="Fecha de eventodetalle" :sortable="true" :visible="false"></Column>
					<Column field="idProveedor" header="Proveedor" :sortable="true"></Column>
                    <Column field="idProducto" header="Producto" :sortable="true"></Column>
                    <Column field="costoProductounitario" header="c/u" :sortable="true"></Column>
                    <Column field="cantidadProductounitario" header="cantidad" :sortable="true"></Column>
                    <Column field="subtotalProductounitario" header="Subtotal" :sortable="true"></Column>
					<Column :colspan="1">
						<template #body="slotProps" >
							<Button label="Detalles" icon="pi-angle-double-right" class="p-button-rounded p-button-primary p-mr-1" @click="detalleEventodetalle(slotProps.data)" />
							<Button label="Editar" icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-1" @click="editarEventodetalle(slotProps.data)" />
							<Button label="Eliminar" icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteEventodetalle(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="eventodetalleDialog" :style="{width: '450px'}" :header="cambiarHeader" :modal="true" :class="cambiarColor">	

					<!-- <img :src="'assets/layout/images/product/' + product.image" :alt="product.image" class="eventodetalle-image" v-if="product.image" /> -->
					<div class="p-field">
						<label for="nombres">Fecha</label>
						<Calendar id="dateformat" v-model="eventodetalle.fechaeventodetalle"  dateFormat="mm-dd-yy" />
					</div>
					<div class="p-field">
                        <label for="detalleeventodetalle">Nombre Eventodetalle</label>
                        <InputText id="detalleeventodetalle" v-model.trim="eventodetalle.detalleeventodetalle" required="true" autofocus :class="{'p-invalid': submitted && !eventodetalle.detalleeventodetalle}" />
                        <small class="p-invalid" v-if="submitted && !eventodetalle.detalleeventodetalle">El nombre del eventodetalle es requerido.</small>
                    </div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Continuar" icon="pi pi-check" class="p-button-text" @click="saveEventodetalle" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteEventodetalleDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="eventodetalle">Are you sure you want to delete <b>{{eventodetalle.nombreEventodetalle}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteEventodetalleDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteEventodetalle(eventodetalle)" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteEventodetallesDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="eventodetalle">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteEventodetallesDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedEventodetalles" />
					</template>
				</Dialog>
			</div>
		</div>
</template>

<script>
import EventodetalleService from '../../../service/evento/eventodetalleService'
class Eventodetalle{
	constructor(idEvento = '', idProveedor = '', idProducto = '', costoProductounitario='', cantidadProductounitario='',subtotalProductounitario=''){
		this.idEvento = idEvento
		this.idProveedor = idProveedor
		this.idProducto = idProducto
		this.costoProductounitario = costoProductounitario
        this.cantidadProductounitario = cantidadProductounitario
        this.subtotalProductounitario = subtotalProductounitario
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
            eventodetalledetalles: [],
            eventodetalle: {},
			eventodetallesdetalles: [],
			status:null,
			estados: [
				{ value: 'Activo', text: 'Activo' },
				{ value: 'Inactivo', text: 'Inactivo' }
			],
			eventodetalleDialog: false,//usar
			nuevo: false,
			deleteEventodetalleDialog: false,
			deleteEventodetallesDialog: false,
			selectedEventodetalle: null,
			selectedEventodetalles: null,
			filters: {},
			submitted: false,
			existenciaSeleccion: false ,
		}
	},
	eventodetalledetalleService: null,
	eventodetalleService: null,
	created() {
        this.eventodetalledetalleService = new EventodetalleService()
	},
	async mounted() {
        await this.eventodetalledetalleService.filtroIdEvento(this.dataEvento[0]._id).then(data =>this.eventodetalledetalles = data.data )
        


	},
	updated(){

	},
	methods: {

		openNew() {
			this.eventodetalle = new Eventodetalle();
			this.eventodetalleDialog = true
			this.submitted = false;
			this.nuevo = false
		},
		hideDialog() {
			this.eventodetalleDialog = false;
			this.submitted = false;
		},
		editarEventodetalle(eventodetalle){
			this.eventodetalleDialog = true
			this.eventodetalle = eventodetalle
		},
		async detalleEventodetalle(eventodetalle){
			this.eventodetalle = eventodetalle
			await this.eventodetalledetalleService.readEventodetallexId(eventodetalle._id).then(data=>this.eventodetallesdetalles = data.data)
			this.$emit('EventEventodetalle', {data1: this.userACargo, data2: this.eventodetalle, data3: this.eventodetallesdetalles, mostrarEventodetalle: false, mostrarEventodetalledetalle : true})
		},
		async saveEventodetalle() {//-------------------------------------------------------------
            this.submitted = true
			const validacion =  !this.eventodetalle.fechaeventodetalle == '' && 
                                !this.eventodetalle.detalleeventodetalle == ''
            if (validacion) {
                if(!this.nuevo === true) {
					this.eventodetalleDialog = false
					//console.log('estoy en if');
					this.$emit('EventEventodetalle', {data1: this.user, data2: this.eventodetalle, data3: null, mostrarEventodetalle: false, mostrarEventodetalledetalle : true})
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});		
                }else {
					this.eventodetalleService.read().then(data =>this.eventodetalledetalles = data.data)
                    this.getEventodetalle(this.eventodetalle)
					//console.log('estoy en else');
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
                }
            }else{
				//console.log('estoy fuera de else');
                this.eventodetalleDialog = true
            }
		},
		getEventodetalle(eventodetalle) {
			this.nuevo = true
			this.eventodetalleService.readEventodetalle(eventodetalle._id).then(data =>{
				const { TipoEventodetalle, nombreEventodetalle, descripcion, status, direccion } = data;
				this.eventodetalle = new Eventodetalle(TipoEventodetalle, nombreEventodetalle, descripcion, status, direccion );
				this.eventodetalleDialog = true
			})
		},
		async deleteEventodetalle(eventodetalle) {
			this.eventodetalle = eventodetalle
			//console.log(this.eventodetalle);
			await this.eventodetalledetalleService.readEventodetallexId(eventodetalle._id).then(data=>this.eventodetallesdetalles= data.data)
			//console.log(this.eventodetallesdetalles);
				for (let index = 0; index < this.eventodetallesdetalles.length; index++) {
					await this.eventodetalledetalleService.delete(this.eventodetallesdetalles[index]._id)
				}
			await this.eventodetalleService.delete(this.eventodetalle._id)
			await this.eventodetalleService.read().then(data=>this.eventodetalledetalles = data.data)
			this.deleteEventodetalleDialog = false
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
		},
		confirmDeleteEventodetalle(eventodetalle) {
			this.eventodetalle = eventodetalle;
			this.deleteEventodetalleDialog = true;
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
			//console.log(this.selectedEventodetalles);
			return (!(!this.selectedEventodetalles || !this.selectedEventodetalles.length) && this.existenciaSeleccion) ? 'p-col-6' : 'p-col-12'
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

.eventodetalle-image {
	width: 100px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .eventodetalle-image {
	width: 150px;
	margin: 0 auto 2rem auto;
	display: block;
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.eventodetalle-badge {
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
