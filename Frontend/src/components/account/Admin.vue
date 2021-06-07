<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div>
				<Toast/>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" disabled="true"/>
						<Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
					</template>

					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="users" v-model:selection="selectedUsers" dataKey="_id" :paginator="true" :rows="10" :filters="filters"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
					<template #header>
						<div class="table-header">
							<h5 class="p-m-0">Administrar Users</h5>
							<span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global']" placeholder="Search..." />
                            </span>
						</div>
					</template>

					<Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
					<!-- <Column field="_id" header="_id" :sortable="true"></Column> -->
					<Column field="nombrePermiso" header="Permiso" :sortable="true"></Column>
                    <Column field="detallePermiso" header="Detalle Permiso" :sortable="true"></Column>
					<Column field="nombres" header="Nombres" :sortable="true"></Column>
                    <Column field="apellidos" header="Apellidos" :sortable="true"></Column>
                    <Column field="email" header="Email" :sortable="true"></Column>
					<Column field="imgUrl" header="Foto">
                        <template #body="slotProps">
                            <img :src="slotProps.data.imgUrl" class="user-image">
                            
                        </template>

                    </Column>
					<Column>
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editUser(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteUser(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="userDialog" :style="{width: '450px'}" :header="cambiarHeader" :modal="true" :class="cambiarColor">	

					<!-- <img :src="'assets/layout/images/product/' + product.image" :alt="product.image" class="product-image" v-if="product.image" /> -->
					<div class="p-field">
						<label for="status">Status</label>
						<Dropdown id="status" v-model="user.status" :options="estados" optionLabel="value" optionValue="text" placeholder="Select One" required="true" :class="{'p-invalid': submitted && !user.status}"></Dropdown>
					</div>
                    <div class="p-field">
                        <label for="nombreUser">Nombre User</label>
                        <InputText id="nombreUser" v-model.trim="user.nombreUser" required="true" autofocus :class="{'p-invalid': submitted && !user.nombreUser}" />
                        <small class="p-invalid" v-if="submitted && !user.nombreUser">El nombre del user es requerido.</small>
                    </div>
                    <div class="p-field">
                        <label for="descripcion">Descripcion</label>
                        <InputText id="descripcion" v-model.trim="user.descripcion" required="true" autofocus :class="{'p-invalid': submitted && !user.descripcion}" />
						<small class="p-invalid" v-if="submitted && !user.descripcion">La descripcion es requerida.</small>
                    </div>
					<div class="p-field">
                        <label for="costo">Costo</label>
                        <InputNumber id="costo" v-model="user.costo" required="false" autofocus  mode="currency" currency="Sol" locale="PEN" />
						
                    </div>
					<template #footer>
						<Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveUser" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteUserDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="user">Are you sure you want to delete <b>{{user.name}}</b>?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser(user)" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteUsersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="confirmation-content">
						<i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
						<span v-if="user">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUsersDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedUsers" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>

</template>

<script>
import UserService from '../../service/user/userService'
class User {
  constructor( nombres='', apellidos = '', email = '') {

    this.nombres = nombres;
    this.apellidos = apellidos;
    this.email = email;
  }
}

export default {
	data() {
		return {
			user: new User(),//usar
			users: [],
			userDialog: false,//usar
			nuevo: false,
			deleteUserDialog: false,
			deleteUsersDialog: false,
			selectedUser: null,
			selectedUsers: null,
			filters: {},
			submitted: false
		}
	},
    userService: null,
	created() {
		this.userService = new UserService()
	},
	mounted() {
        this.userService.read().then( data => this.users = data.data)
        console.log(this.users);
	},
	methods: {
        getUsers(){

        },
		getUseres(){
			fetch('http://localhost:8000/v1/user')
			.then(res => res.json())
			.then(data => {
				this.useres = data
			})
		},
		formatCurrency(value) {
			return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
		},
		openNew() {
			this.user = new User();
			this.userDialog = true
			
			this.submitted = false;
			this.nuevo = false
		},
		hideDialog() {
			this.userDialog = false;
			this.submitted = false;
		},
		editUser(user){
			this.nuevo = true
			this.userDialog = true
			this.user = user
			//console.log(this.user);
		},
		saveUser() {//-------------------------------------------------------------
            this.submitted = true
			const validacion =  !this.user.status == '' && 
								!this.user.nombreUser == '' && 
                                !this.user.descripcion == ''
            if (validacion) {
                if(!this.nuevo === true) {
                    fetch('http://localhost:8000/v1/user', {
                    method: 'POST',
                    body: JSON.stringify(this.user),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                    })
                    .then(res => res.json())
                    .then(() => {
                        this.getUseres()
                        this.user = new User();
                        this.userDialog = false

                    });
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});		
                }else {
                    this.getUser(this.user)
                    fetch('http://localhost:8000/v1/user/' + this.user._id, {
                    method: 'PUT',
                    body: JSON.stringify(this.user),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                    })
                    .then(res => res.json())
                    .then(() => {
                        this.getUseres();
                        this.user = new User();
                        this.userDialog = false
                    });
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
                }
            }else{
                this.userDialog = true
            }
		},
		getUser(user) {
			this.nuevo = true
			fetch('http://localhost:8000/v1/user/' + user._id)
				.then(res => res.json())
				.then(data => {
				const { TipoUser, nombreUser, descripcion, status, direccion } = data;
				this.user = new User(TipoUser, nombreUser, descripcion, status, direccion );
				this.userDialog = true
				});
		},
		deleteUser() {
			fetch('http://localhost:8000/v1/user/' + this.user._id, {
				method: 'DELETE',
				headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
				}
				})
				.then(res => res.json())
				.then(() => {
				this.getUseres();
				this.user = new User();
				});
				this.deleteUserDialog = false
				this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
		},
		confirmDeleteUser(user) {
			this.user = user;
			this.deleteUserDialog = true;
		},
		findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.products.length; i++) {
				if (this.products[i].id === id) {
					index = i;
					break;
				}
			}

			return index;
		},
		createId() {
			let id = '';
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for ( var i = 0; i < 5; i++ ) {
				id += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return id;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			//this.deleteUsersDialog = true;
		},
		deleteSelectedUsers() {
			for (let step = 0; step < this.selectedUsers.length; step++) {
				fetch('http://localhost:8000/v1/user/' + this.selectedUsers[step]._id, {
					method: 'DELETE',
					headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
					}
					})
					.then(res => res.json())
					this.getUseres();
			}
			this.deleteUsersDialog = false;
			this.selectedUsers = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
		},
		deleteSelectedProducts() {
			this.products = this.products.filter(val => !this.selectedProducts.includes(val));
			this.deleteProductsDialog = false;
			this.selectedProducts = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
		}
	}, computed:{
		cambiarHeader(){
			return this.nuevo ? 'Editar' : 'Nuevo'
		},
		cambiarColor(){
			return this.nuevo ? 'p-fluid' : 'p-fluid'
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

.user-image {
	width: 100px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .user-image {
	width: 150px;
	margin: 0 auto 2rem auto;
	display: block;
}

.confirmation-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.user-badge {
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
