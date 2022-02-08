<template>
  <div>
    <DataTable class="p-treetable-sm" :value="sends" dataKey="Id"
               v-model:contextMenuSelection="selected"
               v-model:selection="selected" selection-mode="single"
               v-model:filters="filters"
               filterDisplay="menu"
               :globalFiltersFields="['Id','FullName','statusText','Summary','Title']"
               responsiveLayout="scroll" contextMenu show-gridlines
               :resizableColumns="true" columnResizeMode="fit"
               @row-dblclick="viewIssue"
               @rowContextmenu="onRowContextMenu">


      <template #empty>
        Bir sonuç bulunamadı...
      </template>

      <Column class="text-center" field="Id" header="Id" :sortable="true" :style="{maxWidth:'30px'}">

        <template #body="{data}">
          {{ data.Id }}

        </template>

        <template #filter="{filterModel}">

          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
        </template>
      </Column>


      <Column field="FullName" class="text-center" header="Ad Soyad" :sortable="true" :style="{maxWidth: '80px'}">
        <template #body="{data}">
          {{ data.FullName }}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="Title" header="Konu" class="text-center" :sortable="true" :style="{maxWidth: '100px'}">
        <template #body="{data}">
          {{ data.Title }}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="Summary" header="Kısa Açıklama" :sortable="true" :style="{maxWidth: '300px'}">
        <template #body="{data}">
          {{ data.Summary }}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="statusText" header="Durum" :sortable="true" :style="{maxWidth:'60px'}">
        <template #body="{data}">
          <span :class="'Issue status-' + data.status" class="ml-3">{{ data.statusText }}</span>
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value"/>
        </template>
      </Column>
    </DataTable>
    <ContextMenu ref="cm" :model="menuModel" suppressContextMenu:true/>
    <Dialog v-model:visible="openRejectDialog" :modal="true" :style="{width:'800px', }" class="p-fluid"
            header="Red Sebebi" >
      <div class="p-field grid">
        <div class="col-6 grid align-items-center">
          <div class="col-6">
            <label class="font-bold text-gray-400">Reddedilme Tarihi:</label>
          </div>
          <div class="col-6 ">
            {{rejectInfo.SubmitTime}}
<!--            <InputText style="text-align: center" :disabled="true" v-model="rejectInfo.SubmitTime"></InputText>-->
          </div>
        </div>
        <div class="col-6 grid align-items-center" >
          <div class="col-6 text-right ">
            <label class="font-bold text-gray-400  ">Reddeden Kişi:</label>
          </div>
          <div class="col-6">
            {{rejectInfo.FullName}}
<!--            <InputText style="text-align: center" :disabled="true" v-model="rejectInfo.FullName"></InputText>-->
          </div>
        </div>
      </div>
      <div class="p-field grid">
        <div class="col-12 border-1 border-200 border-round mt-2 p-2">
            {{rejectInfo.Description}}
        </div>
      </div>

    </Dialog>
  </div>

</template>


<script>
import {onMounted, ref, computed,watch} from "vue";
import router from "@/router";

import {FilterMatchMode, FilterOperator} from "primevue/api";

import IssuesService from "@/service/issueService";

import Functions from "@/auxiliary/directive/functions";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import AuthService from "@/service/auth.service";


export default {
  props:['activeIndex'],
  emits:['dataTableLength'],
  setup(props,{emit}) {
    const rejectInfo = ref({})
    const rejectShow = ref(false)
    const sends = ref(null)
    const sendActiveIndexValue = ref(0)
    const cm = ref()
    const Toast = useToast()
    const selected = ref(null)
    const openRejectDialog = ref(false)
    const confirmContext = ref(false)
    const confirm = useConfirm()
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
      'FullName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'Summary': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'Title': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'Id': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'statusText': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},

    })

    const getIssues = () => {
      IssuesService.getIssueListPrivate().then(response => {
        if (!response.Success)
          return

        sends.value = response.Payload
            .map((data) => {
              return {
                Id: data.Id,
                Summary:summaryControl(data.Summary),
                DepartmentName: data.DepartmentName,
                RoleName: data.RoleName,
                FullName: data.FullName,
                status: data.Status,
                statusText: Functions.statusControl(data.Status),
                Title: data.Title,
                CheckCommit:data.CheckCommit,
                UserId:data.UserId
              }

            })
        emit('dataTableLength',sends.value.length)
      })
    }

    watch(()=>props.activeIndex,(value)=>{
      sendActiveIndexValue.value = value
    })
    if (selected.value !== null) {
      confirmContext.value = true
    }

    const menuModel = ref([
      {
        label: computed(() => (rejectShow.value==true && selected.value.FullName == tokenInfo.value )?'Yeni Revizyon Oluştur':'İncele'),
        icon: computed(() => (rejectShow.value==true && selected.value.FullName == tokenInfo.value )?'pi pi-plus':'pi pi-eye'),

        command: () => {
          viewIssue()
        }
      },

      {
        separator: true,
        visible: computed(() => selected.value === 9),
      },
      {
        label: "Red Sebebi",
        visible: computed(() => rejectShow.value),
        command: () => {
          showRejectInfo()
        }

      },
      {
        label: "Sil",
         icon: 'pi pi-trash',
        visible: computed(() => (selected.value.status === 9 || selected.value.status ==0) && selected.value.FullName == tokenInfo.value),
        command: () => {
          deleteIssue()
        }

      }
    ])
/*    const titleControl = (data) =>{
      if(data.length>13){
        let result = data.substring(0, 13);
        return result + "..."
      }else{
        return data;
      }

    }*/
    const tokenInfo = ref(AuthService.getFromTokenFullName());
    const showRejectInfo = () => {
      openRejectDialog.value = true
      IssuesService.getRejectInfo(selected.value.Id).then(response => {

        rejectInfo.value = response.data.Payload
      })

    }
    const summaryControl = (data) =>{
        if(data.length>100){
          let result = data.substring(0, 100);
          return result + "..."
        }else{
          return data;
        }

    }
    const deleteIssue = () => {
      if (selected.value.status == 0 || selected.value.status == 9) {
       // issue.value = issue.value.filter((u) => u.Id !== issue.value.Id);
        confirm.require({
          message: "Hazırlanan kavramsalı silmek isteediğinizden emin misiniz?",
          header: "Onay Ver",
          icon: "pi pi- exclamation-triangle",
          accept: () => {
            IssuesService.deleteIssue(selected.value.Id).then(response => {
              if (response.data.Success) {
                /* users.value.splice(users.value.indexOf(selected.value),1)*/
                Toast.add({severity: 'success', summary: 'Kavramsal Silindi', detail: 'Başarılı', life: 3000});
                sends.value.splice(sends.value.indexOf(selected.value),1)
              }
            })

          },
          reject: () => {
            Toast.add({severity: 'warn', summary: 'Kavramsal Silinemedi', detail: 'Başarısız', life: 3000});
          }
        })
      }
    };
    const viewIssue = () => {
      router.push({
        name: 'issueCreate',
        path: '/issueCreate',
        params: {UserId:selected.value.UserId, data: selected.value.Id, constStatus: selected.value.status,nameData:selected.value.FullName,comingName:selected.value.FullName
          ,comingDepartment:selected.value.DepartmentName,comingRole:selected.value.RoleName,status: selected.value.status,
          activeIndex:sendActiveIndexValue.value,CheckCommit:selected.value.CheckCommit}
      })
    }
    watch(() => selected.value, (value) => {
      if (value.status == 9) {
        rejectShow.value = true;
      } else {
        rejectShow.value = false;
      }

    })
    const onRowContextMenu = (event) => {
      cm.value.show(event.originalEvent);
    };

    onMounted(async () => {
      await getIssues()
    });

    return {
      sends,
      selected,
      menuModel,
      rejectInfo,
      filters,
      cm,
      openRejectDialog,
      rejectShow,
      onRowContextMenu,deleteIssue,
      viewIssue,
      summaryControl,
      sendActiveIndexValue,
      tokenInfo
    }
  }
}
</script>


<style >
textarea { resize: none; }
</style>