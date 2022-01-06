<template>
  <div class="card">
    <h5>Departman Listesi</h5>
    <div class="card">
      <DataTable :value="departments" v-model:selection="selected" selectionMode="single" data-keys="Id"  @rowContextmenu="onRowContextMenu"
                 v-model:contextMenuSelection="selected"
                 show-gridlines
                 responsiveLayout="scroll" scrollHeight="400px" v-model:filters="filters1" filterDisplay="menu" class="p-datatable-users"
                 :globalFiltersFields="['DepartmentName','Id']">

        <template #header>
          <div class="p-d-flex p-jc-between" >
            <Button label="Yeni Departman Oluştur" icon="pi pi-user-plus" class="p-button-success p-button-outlined" @click="createNewDepartment" />

            <department-create
                v-if="createDepartmentDialog" :close-dialog="closeDepartmentDialog"
            ></department-create>

            <span class="p-input-icon-left">
        <i class="pi pi-search col-offset-8"  />
        <InputText class="col-offset-8" v-model="filters1['global'].value"  placeholder="Genel arama" />
      </span>
          </div>


        </template>

        <template #empty>
          Bir sonuç bulunamadı...
        </template>

        <Column field="Id" header="Departman Id"  >
          <template #body="{data}">
            {{data.Id}}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="Definition" header="Departman Adı" >
          <template #body="{data}">
            {{data.Definition}}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>



        <!--     <Column v-for="key in columns" :key="key" :field="key.field" :header="key.header" >

             </Column>-->
        <ContextMenu :model="menuModel" ref="menu" />
      </DataTable>

    </div>
  </div>

</template>

<script>

import { ref,onMounted} from "vue";
import {FilterMatchMode,FilterOperator} from 'primevue/api'

import {useToast} from "primevue/usetoast";
import DepartmentCreate from "../../../components/Departments/DepartmentCreate";
import UsersService from "../../../service/users.service";
import {useConfirm} from  "primevue/useconfirm"

export default {
  components: {DepartmentCreate},
  setup(){
    onMounted(async () => {
     await getDepartment()
    })
    const selected=ref()
    const selectedOperation=ref(1)
    const departments=ref(null)
    const createDepartmentDialog=ref(false)
    const menu=ref()
    const toast=useToast()
    const confirm=useConfirm()

const getDepartment =() =>{
  UsersService.getDepartmentList().then(response =>{
    departments.value=response.Payload
  })
}

    const createNewDepartment= () =>{
      createDepartmentDialog.value=true
    }

    const closeDepartmentDialog = (refresh)=>{
      createDepartmentDialog.value=false
      if (refresh)
      getDepartment()
    }

    const menuModel =ref( [
      {
        label:"Sil",
        icon:"pi pi-trash",
        command:() =>{
          deleteDepartment(selected)
        }
      },

      {
        label:"Kapat",
        icon:"pi pi-power-off"
      },

    ])
    const onRowContextMenu = (event) => {
      menu.value.show(event.originalEvent);
    };

    const deleteDepartment = (department) => {

      departments.value = departments.value.filter((d) => d.Id !== department.value.Id);
      confirm.require({
        message:"Kullanıcıyı silmek isteediğinizden emin misiniz ?",
        header:"Onay Ver",
        icon:"pi pi- exclamation-triangle",
        acceptClass:'p-button-danger',
        accept :() =>{
          UsersService.deleteDepartment(selected.value.Id).then(response =>{
            if (response.data.Success){
              /*departments.value.splice(departments.value.indexOf(selected.value),1)*/
              toast.add({severity: 'warn', summary: 'Departman Silindi', detail:'' ,life:3000});

    }
    })
    },
        reject:()=>{
          toast.add({severity: 'warn', summary: 'Departman Silinemedi', detail:'Başarısız' ,life:3000});
        }
    })
    }


    const filters1=ref({
      'global':{value:null , matchMode:FilterMatchMode.CONTAINS},
      'Definition':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},


    })
    return{
      selected,departments,filters1,createNewDepartment,createDepartmentDialog,closeDepartmentDialog,selectedOperation,
      menuModel,onRowContextMenu,deleteDepartment,menu,getDepartment
    }
  }

}

</script>
<style lang="scss" scoped>

</style>
