<template>
  <div>

    <DataTable class="p-treetable-sm" :value="sends" dataKey="Id"
               v-model:selection="selected" selection-mode="single"
               v-model:filters="filters"
               filterDisplay="menu"
               :globalFiltersFields="['FullName','Department','Role','Status']"
               responsiveLayout="scroll" contextMenu show-gridlines
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

      <Column field="Durum" header="Durum" :style="{width:'250px'}">
        <template #body="{data}">
          <span :class="'Issue status-' + data.status" class="ml-3">{{ data.statusText }}</span>
        </template>
        <template #filter="{filterModel}">
          <InputText type="text" v-model="filterModel.value"/>
        </template>
      </Column>

    </DataTable>
    <ContextMenu ref="cm" :model="menuModel" suppressContextMenu:true/>

    <Dialog v-model:visible="openRejectDialog">
      <div>
        <p>{{ rejectInfo.title }}</p>
      </div>

    </Dialog>
  </div>

</template>


<script>
import {onMounted, ref, computed} from "vue";
import router from "@/router";

import {FilterMatchMode, FilterOperator} from "primevue/api";

import IssuesService from "@/service/issueService";

import Functions from "@/auxiliary/directive/functions";


export default {
  setup() {
    const rejectInfo = ref(null)
    const sends = ref(null)
    const cm = ref()
    const selected = ref(null)
    const openRejectDialog = ref(false)
    const confirmContext = ref(false)

    const filters = ref({
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
      'FullName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'WorkArea': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'status': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
      'DepartmentName': {
        operator: FilterOperator.AND,
        constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]
      },
      'RoleName': {operator: FilterOperator.AND, constraints: [{value: null, matchMode: FilterMatchMode.STARTS_WITH}]},
    })

    const getIssues = () => {
      IssuesService.getIssueListPrivate().then(response => {
        if (!response.Success)
          return

        sends.value = response.Payload
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

    if (selected.value !== null) {
      confirmContext.value = true
    }

    const menuModel = ref([
      {
        label: "İncele",
        icon: "pi pi-eye",

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
        visible: computed(() => selected.value === 9),
        command: () => {
          showRejectInfo()
        }

      }
    ])

    const showRejectInfo = () => {
      openRejectDialog.value = true
      IssuesService.getRejectInfo(selected.value.Id).then(response => {
        rejectInfo.value = response.data.Payload
      })

    }

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
    });

    return {
      sends,
      selected,
      menuModel,
      rejectInfo,
      filters,
      cm,
      openRejectDialog,

      onRowContextMenu,
    }
  }
}
</script>


<style scoped>

</style>