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

      <Column field="Id" header="Id" class="text-center" :sortable="true" :style="{maxWidth:'30px'}">
        <template #body="{data}">
          {{ data.Id }}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
        </template>
      </Column>
      <Column field="DepartmentName" class="text-center" header="Departman" :sortable="true" :style="{maxWidth:'70px'}">
        <template #body="{data}">
          {{ data.DepartmentName }}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="FullName" header="Ad Soyad" class="text-center" :sortable="true" :style="{maxWidth: '80px'}">
        <template #body="{data}">
          {{ data.FullName }}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="Title" header="Konu" :sortable="true" :style="{maxWidth: '70px'}">
        <template #body="{data}">
          {{ data.Title }}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>
      <Column field="Summary" header="Kısa Açıklama" :sortable="true" :style="{maxWidth: '250px'}">
        <template #body="{data}">
          {{ data.Summary }}
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
        </template>
      </Column>

      <Column field="statusText" header="Durum"   :sortable="true" :style="{maxWidth:'70px'}">
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


export default {
  props:['activeIndex'],
  emits:['publicIssueLength'],
  setup(props,{emit}) {

    const rejectInfo = ref({})
    const rejectShow = ref(false)
    const sends = ref(null)
    const cm = ref()

    const selected = ref(null)
    const openRejectDialog = ref(false)
    const confirmContext = ref(false)

    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
      'FullName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'Summary': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'Title': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'Id': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'statusText': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},

    })

    const getIssues = () => {

      IssuesService.getListIssues().then(response =>{
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
                Title: titleControl(data.Title),
                CheckCommit:data.CheckCommit,
                UserId:data.UserId
              }

            })

        emit('publicIssueLength',sends.value.length)

      })
    }

    if (selected.value !== null) {
      confirmContext.value = true
    }

    const menuModel = ref([
      {
        label: computed(() => 'İncele'),
        icon: computed(() =>'pi pi-eye'),

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
    ])
    const showRejectInfo = () => {
      openRejectDialog.value = true
      IssuesService.getRejectInfo(selected.value.Id).then(response => {

        rejectInfo.value = response.data.Payload
      })

    }
    const titleControl = (data) =>{
      if(data.length>20){
        let result = data.substring(0, 20);
        return result + "..."
      }else{
        return data;
      }

    }
    const summaryControl = (data) =>{
      if(data.length>100){
        let result = data.substring(0, 100);
        return result + "..."
      }else{
        return data;
      }

    }
    const viewIssue = () => {
      router.push({
        name: 'issueCreate',
        path: '/issueCreate',
        params: {data: selected.value.Id,
          constStatus: selected.value.status,
          status: selected.value.status,
          nameData:selected.value.FullName,comingName:selected.value.FullName
          ,comingDepartment:selected.value.DepartmentName,
          comingRole:selected.value.RoleName,activeIndex:props.activeIndex,
          CheckCommit:selected.value.CheckCommit,UserId:selected.value.UserId}
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
      onRowContextMenu,
      viewIssue,
      summaryControl,
    }
  }
}
</script>


<style >
textarea { resize: none; }
</style>