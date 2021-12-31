<template>
  <div class="card">
    <h5>Konu Listesi</h5>
    <div class="card">
      <DataTable :value="titles" v-model:selection="selected" selectionMode="single"
                 @rowContextmenu="onRowContextMenu"
                 responsiveLayout="scroll" :scrollable="true" scrollHeight="400px" v-model:filters="filters1"
                 filterDisplay="menu" class="p-datatable-users" showGridlines>

        <template #header>
          <div class="p-d-flex p-jc-between">
            <Button label="Yeni Konu Oluştur" icon="pi pi-user-plus" class="p-button-success p-button-outlined"
                    @click="createNewTitle"/>
            <title-create
                v-if="createUserDialog"
                :close-dialog="closeTitleDialog"
                :subtitle-id="selected ? selected.Id : 0"
                :selectedValue="selected"
                :operation="selectedOperation"
            ></title-create>

            <span class="p-input-icon-left">
        <i class="pi pi-search col-offset-8"/>
        <InputText class="col-offset-8" v-model="filters1['global'].value" placeholder="Genel arama"/>
      </span>
          </div>
        </template>


        <Column field="DepartmentName" header="Departman İsmi">
          <template #body="{data}">
            {{ data.DepartmentName }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="TitleSubject" header="Konu">
          <template #body="{data}">
            {{ data.TitleSubject }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="Subject" header="Alt Konu Başlığı">
          <template #body="{data}">
            {{ data.Subject }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>
        <ContextMenu :model="menuModel" ref="menu" />
      </DataTable>
    </div>
  </div>
</template>

<script>
import {ref,onMounted} from "vue";
import {FilterMatchMode, FilterOperator} from "primevue/api";
import TitleCreate from "@/components/Title/TitleCreate";
import IssuesService from "@/service/issueService";

export default {
  components: {TitleCreate},
  name: "TitleList",
  setup() {
    onMounted(()=>{
      getTitles()
    })
    const selected = ref(null)
    const selectedOperation = ref(1)
    const titles = ref(null)
    const createUserDialog = ref(false)
    const menu = ref()

    const menuModel = ref([
      {
        label: "Sil",
        icon: "pi pi-trash",
        command: () => {
          // deleteTitle(selected)
        }
      },
      {
        label: "Düzelt",
        icon: "pi pi-pencil",
        command: () => {
          updateTitle(selected)
        }
      },


    ])
    const onRowContextMenu = (event) => {
      menu.value.show(event.originalEvent);
    };
    const createNewTitle = () => {
      selected.value = null
      selectedOperation.value = 1
      createUserDialog.value = true
    }

    const updateTitle = () => {
      console.log("selected",selected.value)
      selectedOperation.value = 2
      createUserDialog.value = true
    }

    const closeTitleDialog = () => {
      createUserDialog.value = false
      getTitles()

    }
    const getTitles = () => {
      IssuesService.getAllTitleInfo().then(response =>{
        titles.value = response.data.Payload;
      })
    }

    const filters1 = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
      'TitleSubject': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'Subject': {
        operator: FilterOperator.AND,
        constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
      },
      'DepartmentName': {
        operator: FilterOperator.AND,
        constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
      },

    })


    return {
      selected, titles, filters1, createNewTitle, createUserDialog, closeTitleDialog, selectedOperation, updateTitle,
      menuModel, onRowContextMenu, menu, getTitles
    }
  }

}

</script>

<style scoped>

</style>