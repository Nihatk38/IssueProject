<template>
  <div class="card">
    <h5>Kullanıcı Listesi</h5>
    <div class="card">
    <DataTable :value="users" v-model:selection="selected"  selectionMode="single" dataKey="Id"  @rowContextmenu="onRowContextMenu"
               v-model:contextMenuSelection="selected"
               responsiveLayout="scroll" :scrollable="true" scrollHeight="400px" v-model:filters="filters1"
               filterDisplay="menu" class="p-datatable-users"  showGridlines
               :globalFiltersFields="['FullName','EmailAddress','Department','Role']">
      <template #header>
        <div class="p-d-flex p-jc-between" >
          <Button label="Yeni Kullanıcı Oluştur" icon="pi pi-user-plus" class="p-button-success p-button-outlined" @click="createNewUser" />
        <user-create
          v-if="createUserDialog"
          :close-dialog="closeUserDialog"
          :user-id="selected ? selected.Id : 0"
          :operation="selectedOperation"
        ></user-create>

          <span class="p-input-icon-left">
        <i class="pi pi-search col-offset-8"  />
        <InputText class="col-offset-8" v-model="filters1['global'].value"  placeholder="Genel arama" />
      </span>
        </div>
      </template>
      <template #empty>
        Bir sonuç bulunamadı...
      </template>

      <Column field="FullName" header="Ad Soyad" >
        <template #body="{data}">
          {{data.FullName}}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
        </template>
      </Column>

      <Column field="EmailAddress" header="E-Posta" >
        <template #body="{data}">
          {{data.EmailAddress}}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
        </template>
      </Column>

      <Column field="DepartmentName" header="Departman" >
        <template #body="{data}">
          {{data.DepartmentName}}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
        </template>
      </Column>

      <Column field="RoleName" header="Rol" >
        <template #body="{data}">
          {{data.RoleName}}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
        </template>
      </Column>

      <Column field="IsManager" header="Amir" >
        <template #body="{data}">
          {{data.IsManager}}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
        </template>
      </Column>

      <Column field="IsKeyUser" header="Anahtar" >
        <template #body="{data}">
          {{data.IsKeyUser}}
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

import {ref,onMounted} from "vue";
import {FilterMatchMode,FilterOperator} from 'primevue/api'
import UserCreate from "../../../components/Users/UserCreate";
import {useToast} from "primevue/usetoast";
import UsersService from "../../../service/users.service";
import {useConfirm} from "primevue/useconfirm";

export default {
 components:{UserCreate},
  setup(){
    onMounted( async () => {
     await getUsers()
    })
    const selected=ref(null)
    const selectedOperation=ref(1)
    const users=ref(null)
    const createUserDialog=ref(false)
    const menu=ref()
    const toast=useToast()
    const confirm=useConfirm()

      const getUsers =() =>{
        UsersService.getUserList().then(response =>{
          users.value=response.Payload.map((data)=>{
            return{
              Id:data.Id,
              FullName:data.FullName,
              EmailAddress:data.EmailAddress,
              DepartmentName:data.DepartmentName,
              RoleName:data.RoleName,
              IsManager:statusControlManager(data.IsManager),
              IsKeyUser:statusControlKey(data.IsKeyUser),
            }
          })
        })
      }
      const statusControlKey=(IsManager)=>{
      if(IsManager===true){
        return "Evet"
      }else
        return "Hayır"
      }
      const statusControlManager=(IsKeyUser)=>{
        if(IsKeyUser===true){
          return "Evet"
        }else
          return "Hayır"
      }

    const createNewUser= () => {
      selected.value=null
      selectedOperation.value=1
      createUserDialog.value=true
    }

    const updateUser =() => {
    //  selected.value={...data}
      selectedOperation.value=2
      createUserDialog.value=true
    }

    const closeUserDialog = (refresh) => {
      createUserDialog.value=false
      if (refresh)
        getUsers()
    }

    const menuModel =ref( [
      {
        label:"Sil",
        icon:"pi pi-trash",
        command:() =>{
          deleteUser(selected)
        }
      },
      {
        label:"Düzelt",
        icon:"pi pi-pencil",
        command:() =>{
          updateUser(selected)
        }
      },

    ])
    const onRowContextMenu = (event) => {
      menu.value.show(event.originalEvent);
    };

    const deleteUser = (user) => {
      users.value = users.value.filter((u) => u.Id !== user.value.Id);
      confirm.require({
        message:"Kullanıcıyı silmek isteediğinizden emin misiniz?",
        header:"Onay Ver",
        icon:"pi pi- exclamation-triangle",
        accept :() =>{
          UsersService.deleteUser(selected.value.Id).then(response =>{
            if (response.data.Success){
             /* users.value.splice(users.value.indexOf(selected.value),1)*/
              toast.add({severity: 'success', summary: 'Kullanıcı Silindi', detail:'Başarılı' ,life:3000});
              users.value.splice(users.value.indexOf(selected.value),1)
            }
          })
        },
        reject:()=>{
          toast.add({severity: 'warn', summary: 'Kullanıcı Silinemedi', detail:'Başarısız' ,life:3000});
        }
      })



    };

    const filters1=ref({
      'global':{value:null , matchMode:FilterMatchMode.CONTAINS},
      'FullName':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
      'EmailAddress':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
      'DepartmentName':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
      'RoleName':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
      'IsManager':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
      'IsKeyUser':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
    })
    return{
      selected,users,filters1,createNewUser,createUserDialog,closeUserDialog,selectedOperation,updateUser,
      menuModel,onRowContextMenu,deleteUser,menu,getUsers,statusControlKey //viewUser,updateUser,columns
    }
  }


  }

</script>
<style lang="scss" scoped>

</style>
