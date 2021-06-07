<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div>
				<Toast/>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="Nuevo proveedor" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
					</template>

					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="proveedores" v-model:selection="selectedProveedores" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Administrar Proveedores</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<!-- <Column field="_id" header="_id" :sortable="true"></Column> -->
					<Column field="_id" header="Id" :sortable="true"></Column>
					<Column field="rucProveedor" header="RUC" :sortable="true"></Column>
                    <Column field="razonSocialProveedor" header="Razon Social" :sortable="true"></Column>
					<Column :colspan="1">
						<template #body="slotProps" >
							<Button label="Editar" icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-1" @click="editarProveedor(slotProps.data)" />
							<Button label="Eliminar" icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProveedor(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="proveedorDialog" :style="{width: '450px'}" :header="cambiarHeader" :modal="true" :class="cambiarColor">	

					<!-- <img :src="'assets/layout/images/product/' + product.image" :alt="product.image" class="proveedor-image" v-if="product.image" /> -->
					<div class="p-field">
						<label for="rucProveedor">RUC</label>
						<InputText id="rucProveedor" v-model.trim="proveedor.rucProveedor" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.rucProveedor}" />
                        <small class="p-invalid" v-if="submitted && !proveedor.rucProveedor">El nombre del proveedor es requerido.</small>
					</div>
					<div class="p-field">
                        <label for="razonSocialProveedor">Razon Social</label>
                        <InputText id="razonSocialProveedor" v-model.trim="proveedor.razonSocialProveedor" required="true" autofocus :class="{'p-invalid': submitted && !proveedor.razonSocialProveedor}" />
                        <small class="p-invalid" v-if="submitted && !proveedor.razonSocialProveedor">El nombre del proveedor es requerido.</small>
                    </div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Continuar" icon="pi pi-check" class="p-button-text" @click="saveProveedor" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProveedorDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="proveedor">Are you sure you want to delete <b>{{proveedor.nombreProveedor}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProveedorDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProveedor(proveedor)" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteProveedoresDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="proveedor">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProveedoresDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProveedores" />
					</template>
				</Dialog>
			</div>
		</div>
        <Proveedorproducto v-if="existenciaSeleccion" :dataProveedor="dataProveedor" />
	</div>

</template>

<script>
import auth from '../../service/authenticacion/auth'
import ProveedorService from '../../service/proveedor/proveedorService'
import Proveedorproducto from '../proveedor/contenedor/Proveedorproducto'

class Proveedor{
	constructor(rucProveedor = '', razonSocialProveedor = '' ){
		this.rucProveedor = rucProveedor
		this.razonSocialProveedor = razonSocialProveedor

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
        Proveedorproducto
	},
	data() {
		return {
            proveedores: [],
            proveedor: {},
			proveedoresdetalles: [],
			status:null,
			estados: [
				{ value: 'Activo', text: 'Activo' },
				{ value: 'Inactivo', text: 'Inactivo' }
			],
			proveedorDialog: false,//usar
			nuevo: false,
			deleteProveedorDialog: false,
			deleteProveedoresDialog: false,
			selectedProveedor: null,
			selectedProveedores: null,
			filters: {},
			submitted: false,
			existenciaSeleccion: false ,
			dataProveedor: null
		}
	},
	proveedorService: null,
	created() {
        this.proveedorService = new ProveedorService()

	},
	mounted() {
		this.proveedorService.read().then(data=>this.proveedores = data.data)
		this.Inicializar()
		
	},
	updated(){
		if (this.selectedProveedores == null) {
			this.existenciaSeleccion = false
		}else if(this.selectedProveedores.length == 1){
			this.existenciaSeleccion = true
			this.dataProveedor = this.selectedProveedores
			
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
			this.userService.readUserId(this.proveedor.personacargoProveedor).then(data =>this.user = data.data)
		},
		openNew() {
			this.proveedor = new Proveedor();
			this.proveedorDialog = true
			this.submitted = false;
			this.nuevo = true
		},
		hideDialog() {
			this.proveedorDialog = false;
			this.submitted = false;
		},
		editarProveedor(proveedor){
			this.proveedorDialog = true
			this.proveedor = proveedor
            this.nuevo = false
		},
		async detalleProveedor(proveedor){
			this.proveedor = proveedor
			await this.userService.readUserId(proveedor.personacargoProveedor).then(data=> this.userACargo = data.data)
			this.$emit('EventProveedor', {data1: this.userACargo, data2: this.proveedor, data3: this.proveedoresdetalles, mostrarProveedor: false, mostrarProveedordetalle : true})
			this.userACargo = new User()
		},
		async saveProveedor() {//-------------------------------------------------------------
            this.submitted = true
			const validacion =  !this.proveedor.rucProveedor == '' && 
                                !this.proveedor.razonSocialProveedor == ''
            if (validacion) {
                if(this.nuevo === true) {
					this.proveedorDialog = false
					//console.log('estoy en if');
                    await this.proveedorService.create(this.proveedor).then(data => console.log(data.data))
                    await this.proveedorService.read().then(data => this.proveedores = data.data)
					this.$emit('EventProveedor', {data1: this.user, data2: this.proveedor, data3: null, mostrarProveedor: false, mostrarProveedordetalle : true})
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});		
                }else {
                    this.proveedorDialog = false
					await this.proveedorService.update(this.proveedor._id, this.proveedor).then(() => console.log('terminado'))
                    this.proveedorService.read().then(data =>this.proveedores = data.data)
                    
					//console.log('estoy en else');
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
                }
            }else{
				//console.log('estoy fuera de else');
                this.proveedorDialog = true
            }
		},
		getProveedor(proveedor) {
			this.nuevo = true
			this.proveedorService.readProveedor(proveedor._id).then(data =>{
				const { TipoProveedor, nombreProveedor, descripcion, status, direccion } = data;
				this.proveedor = new Proveedor(TipoProveedor, nombreProveedor, descripcion, status, direccion );
				this.proveedorDialog = true
			})
		},
		async deleteProveedor(proveedor) {
			this.proveedor = proveedor
			//console.log(this.proveedor);

				//for (let index = 0; index < this.proveedoresdetalles.length; index++) {
					//await this.proveedordetalleService.delete(this.proveedoresdetalles[index]._id)
				//}
			await this.proveedorService.delete(this.proveedor._id)
            await this.proveedorService.read().then(data => this.proveedores = data.data)
			this.deleteProveedorDialog = false
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
		},
		confirmDeleteProveedor(proveedor) {
			this.proveedor = proveedor;
			this.deleteProveedorDialog = true;
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
			//console.log(this.selectedProveedores);
			return (!(!this.selectedProveedores || !this.selectedProveedores.length) && this.existenciaSeleccion) ? 'p-col-6' : 'p-col-12'
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

.proveedor-image {
	width: 100px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .proveedor-image {
	width: 150px;
	margin: 0 auto 2rem auto;
	display: block;
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.proveedor-badge {
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
