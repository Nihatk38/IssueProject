<template>
  <div>
    <TabPanel header="">
      <DataTable :value="comingList" contextMenu  v-model:selection="selected" selection-mode="single" dataKey="Id"
                 @rowContextmenu="onRowContextMenu" :scrollable="true" scrollHeight="400px" class="p-treetable-sm"
                 responsiveLayout="scroll"
                 v-model:filters="filters1"
                 filterDisplay="menu"   showGridlines
                 :globalFiltersFields="['FullName','WorkArea','Department','Role','Status']">

        <template #empty>
          Bir sonuç bulunamadı...
        </template>

        <Column field="IssueId" header="Id" >
          <template #body="{data}">
            {{data.Id}}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>


        <Column field="WorkArea" header="Üretim Yeri"  >
          <template #body="{data}">
            {{data.WorkArea}}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="DepartmentName" header="Departman" >
          <template #body="{data}">
            {{data.DepartmentName}}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="RoleName" header="Rol" >
          <template #body="{data}">
            {{data.RoleName}}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="FullName" header="Ad Soyad">
          <template #body="{data}">
            {{data.FullName}}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
        </Column>

        <Column field="Title" header="Konu" >
          <template #body="{data}">
            {{data.Title}}
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>

        </Column>

        <Column field="status" header="Status" :filterMenuStyle="{'width':'5rem'}" style="min-width:5rem">
          <template #body="{data}" >
            <span :class="'Issue status-' + data.status" class="ml-3">{{data.status}}</span>
          </template>
          <template #filter="{filterModel}">
            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
          </template>
          </Column>





      </DataTable>

      <ContextMenu :model="menuModel" ref="cm" />

    </TabPanel>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";
import {useToast} from "primevue/usetoast";
import IssuesService from "../../service/issueService";
import {useConfirm} from "primevue/useconfirm";
import {FilterMatchMode, FilterOperator} from "primevue/api";
import router from "../../router";


export default {
  setup(){
    onMounted( async () => {
      await getIssues()
    })
    const cm=ref()
    const comingList=ref(null)
    const confirmModel=ref({
      IssueId:'',
      Description:''
    })
    const selected=ref(null)
    const toast=useToast()
    const confirm=useConfirm()
    const filters1=ref({
      'global':{value:null , matchMode:FilterMatchMode.CONTAINS},
      'FullName':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
      'WorkArea':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
      'status':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
      'DepartmentName':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
      'RoleName':{operator:FilterOperator.AND,constraints:[{value:null,matchMode: FilterMatchMode.STARTS_WITH}]},
    })



    const getIssues =() =>{
      IssuesService.getIssueListPublic().then(response =>{
        if(!response.Success)
          return
        comingList.value=response.Payload
        .map((data)=>{
          return{
            Id:data.Id,
            WorkArea:data.WorkArea,
            DepartmentName:data.DepartmentName,
            RoleName:data.RoleName,
            FullName:data.FullName,
            DepartmentId:data.DepartmentId,
            status:statusControl(data.Status),
            Title:data.Title
          }
        })
      })
    }
    const statusControl = (status) => {
      if(status === 0){
        return  "calisiyor";
      }else if(status === 1){
        return "BimOnayBekleme";
      } else if(status === 2){
        return "BimOnay";
      }else if(status === 3){
        return "DepartmanOnay";
      }else if(status === 4){
        return "YazanAmirOnay";
      }else if(status === 5){
        return "Kilitli";
      }else if(status === 6){
        return "RedYapilmayacak";
      } else {
        return "Onaylandi"
      }
    }
    const menuModel =ref( [


      {
        label:"İncele",
        icon:"pi pi-eye",
        command:() =>{
           viewIssue()
        }
      },

      {
        label:"Kapat",
        icon:"pi pi-power-off"
      },
    ])
    const viewIssue = ()=>{
      router.push({
        name: 'issueCreate',
        path: '/issueCreate',
        params: {data:selected.value.Id,status:selected.value.status}
      })
    }

    const answerIssue= () =>{
      confirmModel.value.IssueId=selected.value.Id;
      confirm.require({
        message:"Projeyi onaylamak istediğinizden emin misiniz?",
        header:"Onay Ver",
        icon:"pi pi- exclamation-triangle",
        accept :() =>{
          IssuesService.IssueConfirm(confirmModel.value).then(response =>{
            if (response.Success){
              toast.add({severity: 'success', summary: 'Onaylandı', detail:'Başarılı' ,life:3000});
            }else{
              toast.add({severity: 'error', summary: response.Information, detail:'Başarısız' ,life:3000});
            }
          })
        },
        reject:()=>{
          toast.add({severity: 'warn', summary: 'Onaylanamadı', detail:'Başarısız' ,life:3000});
        }
      })
    }
    const onRowContextMenu = (event) => {
      cm.value.show(event.originalEvent);
    };

    return{
      comingList,selected,onRowContextMenu,toast,menuModel,answerIssue,cm,confirmModel,filters1,statusControl,viewIssue
    }
  }
}
</script>


<style >

.Issue {
  border-radius: 2px;
  padding: 0.25rem 1rem;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: .3px;
}
.Issue.status-calisiyor {
  background-color: #efdf90;
  color: #774f25;
}
.Issue.status-BimOnay {
  background-color: #0de82a;
  color: #011e05;
}

.Issue.status-BimOnayBekleme {
  background-color: #76c7b1;
  color: #098066;
}
.Issue.status-DepartmanOnay {
  background-color: #c4b9ec;
  color: #2d2936;
}
.Issue.status-YazanAmirOnay {
  background-color: #d3cabf;
  color: #2f2e29;
}
.Issue.status-RedYapilmayacak {
  background-color: #f1b0b7;
  color: #ff0000;
}
.Issue.status-BimOnay {
  background-color: #c8e6c9;
  color: #256029;
}
.Issue.status-Kilitli {
  background-color: #ffd8b2;
  color: #805b36;
}
.Issue.status-Onaylandi {
  background-color: #7ff18d;
  color: #013f0b;
}

</style>