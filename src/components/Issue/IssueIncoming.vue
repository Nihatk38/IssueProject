<template>
  <div>
    <TabPanel header="">
      <DataTable class="p-treetable-sm" :value="comingList" dataKey="Id"
                 v-model:selection="selected" selection-mode="single"
                 v-model:contextMenuSelection="selected"
                 v-model:filters="filters"
                 filterDisplay="menu"
                 :globalFiltersFields="['FullName','Department','statusText']"
                 responsiveLayout="scroll" contextMenu showGridlines
                 :resizableColumns="true" columnResizeMode="fit"
                 @row-dblclick="viewIssue"
                 @rowContextmenu="onRowContextMenu">

        <template #empty>
          Bir sonuç bulunamadı...
        </template>

        <Column field="Id" header="Id" :sortable="true" :style="{maxWidth:'30px'}">
          <template #body="{data}">
            {{ data.Id }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="DepartmentName" header="Departman" :style="{maxWidth:'90px'}">
          <template #body="{data}">
            {{ data.DepartmentName }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
          </template>
        </Column>

        <Column field="FullName" header="Ad Soyad" :style="{maxWidth: '100px'}">
          <template #body="{data}">
            {{ data.FullName }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
          </template>
        </Column>
        <Column field="Summary" header="Kısa Açıklama" :style="{maxWidth: '250px'}">
          <template #body="{data}">
            {{ data.Summary }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
          </template>
        </Column>
        <Column field="Title" header="Konu" :style="{maxWidth: '70px'}">
          <template #body="{data}">
            {{ data.Title }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
          </template>
        </Column>

        <Column field="statusText" header="Durum" :style="{maxWidth:'100px'}">
          <template #body="{data}">
            <span :class="'Issue status-' + data.status" class="ml-3">{{ data.statusText }}</span>
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value"/>
          </template>
        </Column>


      </DataTable>

      <ContextMenu :model="menuModel" ref="cm"/>

    </TabPanel>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import router from "@/router";

import {FilterMatchMode, FilterOperator} from "primevue/api";

import IssuesService from "@/service/issueService";

import Functions from "@/auxiliary/directive/functions";

export default {
  emits:['dataTableLength'],
  setup(props,{emit}) {
    const cm = ref()
    const comingList = ref(null)
    const selected = ref(null)
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
      'Id': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'FullName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'Title': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'statusText': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'DepartmentName': {
        operator: FilterOperator.AND,
        constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
      },
    })

    const getIssues = () => {
      IssuesService.getIssueListPublic().then(response => {
        if (!response.Success)
          return
        console.log("response",response.Payload)
        comingList.value = response.Payload
            .map((data) => {
              return {
                Id: data.Id,
                Summary:summaryControl(data.Summary),
                DepartmentName: data.DepartmentName,
                RoleName: data.RoleName,
                FullName: data.FullName,
                DepartmentId: data.DepartmentId,
                status: data.Status,
                statusText: Functions.statusControl(data.Status),
                Title: titleControl(data.Title)
              }
            })

        emit('dataTableLength',comingList.value.length)
      })
    }

    const menuModel = ref([
      {
        label: "İncele",
        icon: "pi pi-eye",
        command: () => {
          viewIssue()
        }
      },
    ])
    const summaryControl = (data) =>{
      if(data.length>60){
        let result = data.substring(0, 60);
        return result + "..."
      }else{
        return data;
      }

    }
    const titleControl = (data) =>{
      if(data.length>15){
        let result = data.substring(0, 15);
        return result + "..."
      }else{
        return data;
      }

    }
    const viewIssue = () => {
      router.push({
        name: 'issueCreate',
        path: '/issueCreate',
        params: {data: selected.value.Id, status: selected.value.status,comingName:selected.value.FullName,
          comingDepartment:selected.value.DepartmentName,comingRole:selected.value.RoleName}
      })
    }

    const onRowContextMenu = (event) => {
      cm.value.show(event.originalEvent);
    };

    onMounted(async () => {
      await getIssues()
    })

    return {
      comingList,
      selected,
      filters,
      menuModel,
      cm,
      viewIssue,
      onRowContextMenu
    }
  }
}
</script>


<style>

</style>