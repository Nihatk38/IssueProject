<template>
  <div class="card">
    <h5>Konu Listesi</h5>
    <div class="card">
      <TabView>
        <TabPanel header="Konular">
          <DataTable :value="titles" v-model:selection="selected" selectionMode="single"
                     @rowContextmenu="onRowContextMenu"
                     responsiveLayout="scroll" :scrollable="true" scrollHeight="400px" v-model:filters="filters1"
                     filterDisplay="menu" class="p-datatable-users" showGridlines>

            <template #header>
              <div class="p-d-flex p-jc-between">
                <Button label="Yeni Konu Oluştur" icon="pi pi-check" class="mr-2 p-button-success p-button-outlined"
                        @click="createNewTitle"/>

                <title-create
                    v-if="createTitleDialog"
                    :close-dialog="closeTitleDialog"
                    :subtitle-id="selected ? selected.Id : 0"
                    :selectedValue="selected"
                    :operation="selectedOperation"
                    :clicked = createTitleDialog
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

            <Column field="Subject" header="Konu">
              <template #body="{data}">
                {{ data.Subject }}
              </template>
              <template #filter="{filterModel}">
                <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
              </template>
            </Column>

            <ContextMenu :model="menuModel" ref="menu" />
          </DataTable>
        </TabPanel>
        <TabPanel header="Alt Konular">
          <DataTable :value="Subtitles" v-model:selection="selected" selectionMode="single"
                     v-model:contextMenuSelection="selected"
                     @rowContextmenu="onRowContextMenu"
                     responsiveLayout="scroll" :scrollable="true" scrollHeight="400px" v-model:filters="filters1"
                     filterDisplay="menu" class="p-datatable-users" showGridlines>

            <template #header>
              <div class="p-d-flex p-jc-between">

                <Button label="Yeni Alt Konu Oluştur" icon="pi pi-check-circle" class="  p-button-secondary p-button-outlined"
                        @click="createNewSubtitle"/>
                <subtitle-create
                    v-if="createSubtitleDialog"
                    :close-dialog="closeSubtitleDialog"
                    :subtitle-id="selected ? selected.Id : 0"
                    :selectedValue="selected"
                    :operation="selectedOperation"
                    :clicked = createSubtitleDialog
                ></subtitle-create>
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
        </TabPanel>

      </TabView>

    </div>
  </div>
</template>

<script>
import {ref, onMounted, computed} from "vue";
import {FilterMatchMode, FilterOperator} from "primevue/api";
import SubtitleCreate from "@/components/Title/SubtitleCreate";
import TitleCreate from "@/components/Title/TitleCreate";
import IssuesService from "@/service/issueService";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";

export default {
  components: {SubtitleCreate,TitleCreate},
  name: "TitleList",
  setup() {
    onMounted(()=>{
      getSubtitles()
      getTitles()

    })
    const selected = ref(null)
    const selectedOperation = ref(1)
    const titles = ref(null)
    const Subtitles = ref(null)
    const createSubtitleDialog = ref(false)
    const createTitleDialog = ref(false)
    const menu = ref()
    const toast = useToast()
    const confirm = useConfirm()
    const menuModel = ref([
      {
        label: "Sil",
        icon: "pi pi-trash",
        visible: computed(() => selected.value.TitleSubject == null ? false : true),
        command: () => {
           deleteSubtitle(selected.value.Id)
        }
      },
      {
        label: "Düzelt",
        icon: "pi pi-pencil",
        command: () => {
          updateTitle()
        }
      },


    ])
    const onRowContextMenu = (event) => {
      menu.value.show(event.originalEvent);
    };
    const deleteSubtitle = (Id) => {
      confirm.require({
        message:"Alt Konu Başlığını silmek isteediğinizden emin misiniz?",
        header:"Onay Ver",
        icon:"pi pi- exclamation-triangle",
        accept :() =>{
          IssuesService.deleteSubtitle(Id).then(response =>{
            if(response.data.Result.Success){
              Subtitles.value.splice(findIndexByIdContact(Id),1)
              toast.add({severity:'warn',detail:'Başarılı',summary:'Subtitle Silindi',life:4000})
            }
          })
        },
        reject:()=>{
          toast.add({severity:'error',detail:'Başarısız',summary:'Subtitle Silinemedi',life:4000})
        }
      })
    };
    const createNewSubtitle = () => {
      selected.value = null
      selectedOperation.value = 1
      createSubtitleDialog.value = true
    }
    const createNewTitle = () => {
      selected.value = null
      selectedOperation.value = 1
      createTitleDialog.value = true
    }
    const findIndexByIdContact = (Id) => {
      let index = -1;
      for (let i = 0; i < Subtitles.value.length; i++) {
        if (Subtitles.value[i].Id === Id) {
          index = i;
          break;
        }
      }
      return index;
    }
    const updateTitle = () => {
      selectedOperation.value = 2
      if(selected.value.TitleSubject == null )
        createTitleDialog.value=true
      else
      createSubtitleDialog.value = true

    }

    const closeSubtitleDialog = () => {
      createSubtitleDialog.value = false
      getSubtitles()

    }
    const closeTitleDialog = () => {
      createTitleDialog.value = false
      getTitles()

    }
    const getSubtitles = () => {
      IssuesService.GetAllSubtitleInfo().then(response =>{
        Subtitles.value = response.data.Payload;
      })
    }
    const getTitles = () => {
      IssuesService.GetAllTitleInfo().then(response =>{
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
      selected, titles,Subtitles, filters1, createNewSubtitle,createNewTitle, createSubtitleDialog, closeTitleDialog, selectedOperation, updateTitle,
      menuModel, onRowContextMenu, menu, getSubtitles,getTitles,findIndexByIdContact,createTitleDialog,closeSubtitleDialog
    }
  }

}

</script>

<style scoped>

</style>