<template>
	<div class="layout-profile">
		<div>
			<img :src="usuario.imgUrl" alt="" />
		</div>
		<button class="p-link layout-profile-link" @click="onClick">
			<span class="username">{{usuario.nombres + ' ' + usuario.apellidos}}</span>
			<i class="pi pi-fw pi-cog"></i>
		</button>
        <transition name="layout-submenu-wrapper">
            <ul v-show="expanded">
                <li><button class="p-link" @click="IrAAccount"><i class="pi pi-fw pi-user"></i><span>Account</span></button></li>
                <li><button class="p-link" @click="IrANotificaciones"><i class="pi pi-fw pi-inbox"></i><span>Notifications</span><span class="menuitem-badge">2</span></button></li>
                <li><button class="p-link" @click="logout"><i class="pi pi-fw pi-power-off" ></i><span>Logout</span></button></li>
            </ul>
        </transition>
		
	</div>
</template>

<script>
	export default {
		props:{
			usuario: Object
		},
		data() {
			return {
				expanded: false
			}
		},
		created(){
		},
		methods: {
			onClick(event){
				this.expanded = !this.expanded;
				event.preventDefault();
			},
			logout(){
				//console.log({login: true, register: false, logged: false});
				this.$emit('estadoProfile',{login: true, register: false, logged: false})
			},
			IrAAccount(){
				this.$router.push("/account");
			},
			IrANotificaciones(){
				this.$router.push("/notificaciones");
			}
		}
	}
</script>

<style scoped>

</style>