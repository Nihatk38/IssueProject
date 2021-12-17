<template>
  <div>

    <DataTable v-model:selection="selected" :scrollable="true" :value="sends" class="p-treetable-sm"
               contextMenu dataKey="Id"
               selection-mode="single" show-gridlines @rowContextmenu="onRowContextMenu">


      <template #empty>
        Bir sonuç bulunamadı...
      </template>

      <Column field="IssueId" header="Id">
        <template #body="{data}">
          {{ data.Id }}
        </template>

      </Column>


      <Column field="WorkArea" header="Üretim Yeri">
        <template #body="{data}">
          {{ data.WorkArea }}
        </template>
      </Column>

      <Column field="DepartmentName" header="Departman">
        <template #body="{data}">
          {{ data.DepartmentName }}
        </template>
      </Column>

      <Column field="RoleName" header="Rol">
        <template #body="{data}">
          {{ data.RoleName }}
        </template>
      </Column>

      <Column field="FullName" header="Ad Soyad">
        <template #body="{data}">
          {{ data.FullName }}
        </template>
      </Column>

      <Column field="Title" header="Konu">
        <template #body="{data}">
          {{ data.Title }}
        </template>

      </Column>

      <Column :filterMenuStyle="{'width':'5rem'}" field="status" header="Status" style="min-width:5rem">
        <template #body="{data}">
          <span :class="'Issue status-' + data.status" class="ml-3">{{ data.status }}</span>
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
import {onMounted, ref, computed, watch} from "vue";
import {useToast} from "primevue/usetoast";
import IssuesService from "../../service/issueService";
import router from "../../router";
import {useConfirm} from "primevue/useconfirm";


export default {
  setup() {
    onMounted(async () => {
      await getIssues()
    })
    const rejectİnfo = ref(null)
    const sends = ref(null)
    const cm = ref()
    const selected = ref(null)
    const selectedIssue = ref()
    const toast = useToast()
    const confirm = useConfirm()
    const rejectShow = ref(false)
    const showIssue = ref(false)
    const openRejectDialog = ref(false)
    const confirmModel = ref({
      IssueId: '',
      Description: ''
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
                status: statusControl(data.Status),
                Title: data.Title

              }
            })
      })
    }


    const statusControl = (status) => {
      if (status === 0) {
        return "calisiyor";
      } else if (status === 1) {
        return "BimOnayBekleme";
      } else if (status === 2) {
        return "BimOnay";
      } else if (status === 3) {
        return "DepartmanOnay";
      } else if (status === 4) {
        return "YazanAmirOnay";
      } else if (status === 5) {
        return "Kilitli";
      } else if (status === 6) {
        rejectShow.value = true;
        return "RedYapilmayacak";
      } else {
        return "Onaylandi"
      }
    }
    /*  if(selected.value.status==="calisiyor"){
        showIssue.value=true
      }
  */
    const confirmContext = ref(false)

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
        label: "Red Sebebi",
        visible: computed(() => rejectShow.value),
        command: () => {
          rejectInfo()
        }

      },
      {
        label: "Direkt Kaydet",
        icon: "pi pi-save",
        disabled: confirmContext,
        command: () => {
          answerIssue()
        }
      },
    ])
    const rejectInfo = () => {
      openRejectDialog.value = true
      IssuesService.getRejectInfo(selected.value.Id).then(response => {
        rejectİnfo.value = response.data.Payload
      })

    }
    watch(() => selected.value, (value) => {
      console.log("value.status", value.status)
      if (value.status == "RedYapilmayacak") {
        rejectShow.value = true;
        console.log("rejectvaluees", rejectShow.value)
      } else {
        rejectShow.value = false;
        console.log("rejectvaluees", rejectShow.value)
      }

    })
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
    const answerIssue = () => {
      confirmModel.value.IssueId = selected.value.Id;
      confirm.require({
        message: "Projeyi onaylamak istediğinizden emin misiniz?",
        header: "Onay Ver",
        icon: "pi pi- exclamation-triangle",
        accept: () => {
          IssuesService.IssueConfirm(confirmModel.value).then(response => {
            if (response.Success) {
              toast.add({severity: 'success', summary: 'Onaylandı', detail: 'Başarılı', life: 3000});
              selected.value.status = "BimOnayBekleme"
            }
          })
        },
        reject: () => {
          toast.add({severity: 'warn', summary: 'Onaylanamadı', detail: 'Başarısız', life: 3000});
        }
      })
    }
    return {
      sends,
      selected,
      selectedIssue,
      onRowContextMenu,
      toast,
      menuModel,
      rejectİnfo,
      viewIssue,
      cm,
      statusControl,
      answerIssue,
      confirmModel,
      rejectShow,
      showIssue,
      openRejectDialog,
      rejectInfo
    }
  }
}
</script>


<style scoped>

</style>