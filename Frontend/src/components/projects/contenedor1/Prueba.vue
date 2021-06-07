<template>
    <div class="p-grid">
        <div class="p-col-12">
            <div class="card">
                <div class="p-field">
						<label for="statusCliente">Lista de imagenes</label>
						<Dropdown id="useracargo" v-model="valor" :options="lista" optionLabel="value" optionValue="text" placeholder="Select One" required="true" v-on:change="ejecutar"></Dropdown>
					</div>
                <div class="p-field">
                    <img :src="valor"  class="project-image" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import Project from './Project'
export default {
    components:{
    },
    props:{

    },
    data() {
        return {
            valor: null,
            lista: [ 
                {"value":"Jhoanna","text":"http://localhost:8110/public/jhoanna.png"},
                {"value":"Amy","text":"http://localhost:8110/public/amy.png"}
                ]

        }

    },
    created(){

    },
    mounted(){

    },
    updated(){

    },
    methods:{
        ejecutar(){
            //console.log(this.value);
        }

    },
    computed:{

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
	width: 500px;
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
