<template>
  <div>
    <TabPanel header="">
      <DataTable class="p-treetable-sm" :value="comingList" dataKey="Id"
                 v-model:selection="selected" selection-mode="single" r
                 v-model:filters="filters"
                 filterDisplay="menu"
                 :globalFiltersFields="['FullName','Department','Role','Status']"
                 esponsiveLayout="scroll" contextMenu showGridlines
                 :resizableColumns="true" columnResizeMode="fit"
                 @rowContextmenu="onRowContextMenu">

        <template #empty>
          Bir sonuç bulunamadı...
        </template>

        <Column field="IssueId" header="Id" :style="{width:'100px'}">
          <template #body="{data}">
            {{ data.Id }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="DepartmentName" header="Departman">
          <template #body="{data}">
            {{ data.DepartmentName }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
          </template>
        </Column>

        <Column field="FullName" header="Ad Soyad">
          <template #body="{data}">
            {{ data.FullName }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
          </template>
        </Column>

        <Column field="Title" header="Konu">
          <template #body="{data}">
            {{ data.Title }}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter"/>
          </template>
        </Column>

        <Column field="status" header="Durum" :style="{width:'250px'}">
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
  setup() {
    const cm = ref()
    const comingList = ref(null)
    const selected = ref(null)
    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
      'Id': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'FullName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'Title': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'status': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'DepartmentName': {
        operator: FilterOperator.AND,
        constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
      },
      'RoleName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
    })

    const getIssues = () => {
      IssuesService.getIssueListPublic().then(response => {
        if (!response.Success)
          return
        comingList.value = response.Payload
            .map((data) => {
              return {
                Id: data.Id,
                WorkArea: data.WorkArea,
                DepartmentName: data.DepartmentName,
                RoleName: data.RoleName,
                FullName: data.FullName,
                DepartmentId: data.DepartmentId,
                status: data.Status,
                statusText: Functions.statusControl(data.Status),
                Title: data.Title
              }
            })
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

    const viewIssue = () => {
      router.push({
        name: 'issueCreate',
        path: '/issueCreate',
        params: {data: selected.value.Id, status: selected.value.status}
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

      onRowContextMenu
    }
  }
}
</script>


<style>

</style>