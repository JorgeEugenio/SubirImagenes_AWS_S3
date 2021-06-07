<template>
    <div class="p-col-6">
        <div>
            <Toast/>
            <DataTable ref="dt" :value="projectdetalles" dataKey="_id" :paginator="true" :rows="15" :filters="filters"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" :rowsPerPageOptions="[15,75,100]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                <Column selectionMode="multiple" headerStyle="width: 3rem" ></Column>
                <Column field="whatsapp" header="whtspp" :sortable="true" style="text-align: center;">
                    <template #body="slotProps" >
                        <div class="table-center">
                            <span :class="'whtspp status-'+ slotProps.data.whatsapp">{{slotProps.data.detalle_projectDetalleName}}</span>
                        </div>
                    </template>
                </Column>
                <Column header="whtsppLnk" :sortable="true">
                    <template #body="slotProps" class="centered-input text--darken-3 mt-3">
                        <div class="table-header">
                            <a :href="'https://wa.me/51'+ slotProps.data.numeroCelular">{{slotProps.data.detalle_createdAt}}</a>
                        </div>
                    </template>
                </Column>
                <Column field="estadoCelular" header="estado" :sortable="true">
                    <template #body="slotProps">
                        <div class="table-center">
                            <span :class="'celular-badge status-' + slotProps.data.estadoCelular">{{ slotProps.data.detalle_updatedAt}}</span>
                        </div>
                    </template>
                </Column>
                <Column field="detalles" header="Detalles" :sortable="true"></Column>
                <Column>
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editCelular(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteCelular(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import ProjectdetalleService from '../../../service/project/projectdetalleService'
export default {
    components:{
    },
    props:{
        
        dataProjectListaFantasma: Object
    },
    projectdetalleService: null,
    data() {
        return {
            filters: [],
            projectdetalles: []
        }

    },
    created(){
        this.projectdetalleService = new ProjectdetalleService()
        console.log(this.dataProjectListaFantasma[0]._id);
    },
    async mounted(){
        await this.projectdetalleService.readProjectxId(this.dataProjectListaFantasma[0]._id).then(data=>this.projectdetalles = data.data)
        console.log(this.projectdetalles);
    },
    updated(){

    },
    methods:{

    },
    computed:{

    }

}
</script>

<style scoped>

</style>