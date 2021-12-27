<template>
  <div class="card">
    <h5>Konu Listesi</h5>
    <div class="card">
      <DataTable :value="users" v-model:selection="selected" selectionMode="single" dataKey="Id"
                 @rowContextmenu="onRowContextMenu"
                 responsiveLayout="scroll" :scrollable="true" scrollHeight="400px" v-model:filters="filters1"
                 filterDisplay="menu" class="p-datatable-users" showGridlines>

        <template #header>
          <div class="p-d-flex p-jc-between">
            <Button label="Yeni Konu Oluştur" icon="pi pi-user-plus" class="p-button-success p-button-outlined"
                    @click="createNewTitle"/>
            <title-create
                v-if="createUserDialog"
                :close-dialog="closeUserDialog"
                :subtitle-id="selected ? selected.Id : 0"
                :operation="selectedOperation"
            ></title-create>

            <span class="p-input-icon-left">
        <i class="pi pi-search col-offset-8"/>
        <InputText class="col-offset-8" v-model="filters1['global'].value" placeholder="Genel arama"/>
      </span>
          </div>
        </template>


        <Column field="DepartmanName" header="DepartmanName">
          <template #body="{data}">
            {{ data.DepartmanName }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="Title" header="Title">
          <template #body="{data}">
            {{ data.Title }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="Subtitle" header="Subtitle">
          <template #body="{data}">
            {{ data.Subtitle }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import {FilterMatchMode, FilterOperator} from "primevue/api";
import TitleCreate from "@/components/Title/TitleCreate";

export default {
  components: {TitleCreate},
  name: "TitleList",
  setup() {

    const selected = ref(null)
    const selectedOperation = ref(1)
    const users = ref(null)
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
        label: "Güncelle",
        icon: "pi pi-pencil",
        command: () => {
          updateTitle(selected)
        }
      },

      {
        label: "Kapat",
        icon: "pi pi-power-off"
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
      //  selected.value={...data}
      selectedOperation.value = 2
      createUserDialog.value = true
    }

    const closeUserDialog = (refresh) => {
      createUserDialog.value = false
      if (refresh)
        getTitles()
    }
    const getTitles = () => {

    }

    const filters1 = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
      'Title': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'Subtitle': {
        operator: FilterOperator.AND,
        constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
      },
      'DepartmentName': {
        operator: FilterOperator.AND,
        constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
      },

    })


    return {
      selected, users, filters1, createNewTitle, createUserDialog, closeUserDialog, selectedOperation, updateTitle,
      menuModel, onRowContextMenu, menu, getTitles
    }
  }

}

</script>

<style scoped>

</style>