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


export default {
  setup() {
    const rejectInfo = ref({})
    const rejectShow = ref(false)
    const sends = ref(null)
    const cm = ref()
    const Toast = useToast()
    const selected = ref(null)
    const openRejectDialog = ref(false)
    const confirmContext = ref(false)
    const confirm = useConfirm()
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
        label: computed(() => rejectShow.value==true?'Yeni Revizyon Oluştur':'İncele'),
        icon: computed(() => rejectShow.value==true?'pi pi-plus':'pi pi-eye'),

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
        visible: computed(() => selected.value.status === 9 || selected.value.status ==0),
        command: () => {
          deleteIssue()
        }

      }
    ])

    const showRejectInfo = () => {
      openRejectDialog.value = true
      IssuesService.getRejectInfo(selected.value.Id).then(response => {

        rejectInfo.value = response.data.Payload
      })

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
        params: {data: selected.value.Id, status: selected.value.status,nameData:selected.value.FullName,comingName:selected.value.FullName
          ,comingDepartment:selected.value.DepartmentName,comingRole:selected.value.RoleName}
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
      onRowContextMenu,deleteIssue
    }
  }
}
</script>


<style >
textarea { resize: none; }
</style>