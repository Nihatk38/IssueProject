<template>
  <div >
    <div class="card">
      <div class="p-card-title flex justify-content-between">
        <h5>Konu Listesi</h5>

        <Button v-if="IsCreated" label="Yeni Konu Oluştur" class="p-button-success p-button-outlined align-self-end"
                icon="pi pi-plus"
                @click="newIssue"></Button>
      </div>
      <TabView ref="tabview1" v-model:activeIndex="activeIndexValue"  >

        <TabPanel v-if="!IsManager && IsKeyUser" >
          <template #header>
          <span class="mr-2"> Departman Yazılanlar</span>
            <i class=" pi pi-bell    p-text-secondary" style="font-size: 1.5rem" v-badge="sendsTableLength"></i>
          </template>
          <issue-send
              :key="renderComponent"
              :activeIndex="activeValue"
              @dataTableLength="IssueSendLength"
          ></issue-send>
        </TabPanel>
        <TabPanel v-if="IsKeyUser || IsManager ">
          <template #header>
            <span class="mr-2"> Bana Gelenler</span>
            <i class=" pi pi-envelope    p-text-secondary" style="font-size: 1.5rem" v-badge.danger="incomingTableLength"></i>
          </template>
        <issue-incoming
            :key="renderComponent"
            @dataTableLength="IncomingDataTableLength"
        ></issue-incoming>
      </TabPanel>
        <TabPanel   v-if="IsManager ">
          <template #header>
            <span class="mr-2"> İlgili Talepler</span>
            <i class=" pi pi-bell    p-text-secondary" style="font-size: 1.5rem" v-badge="relevantTableLength"></i>
          </template>
          <relevant-issue
              :activeIndex="activeValue"
              @relevantIssueLength="relevantTable"
          ></relevant-issue>
        </TabPanel>
        <TabPanel   v-if="IsVisible">
          <template #header>
            <span class="mr-2"> Tüm Talepler</span>
            <i class=" pi pi-bell    p-text-secondary" style="font-size: 1.5rem" v-badge="publicIssueTableLength"></i>
          </template>
          <public-issue
              :activeIndex="activeValue"
              @publicIssueLength="publicIssueTable"
          > </public-issue>

        </TabPanel>

      </TabView>
    </div>
  </div>

</template>

<script >

import IssueSend from "../../../components/Issue/IssueSend";
import IssueIncoming from "../../../components/Issue/IssueIncoming";
import {useToast} from "primevue/usetoast";
import router from "../../../router";
import {ref, computed, watch} from "vue";
import AuthService from "@/service/auth.service";
import RelevantIssue from "@/components/Issue/RelevantIssue";
import PublicIssue from "@/components/Issue/PublicIssue";
export default {
  components: {PublicIssue, RelevantIssue, IssueIncoming, IssueSend},

  setup() {

    const toast = useToast()

    const reRender=ref(false);
    const plus =ref(0)
    const renderComponent=computed(() => plus.value +1)
    const token = AuthService.isAuth()
    const IsManager = ref(false)
    IsManager.value = token.IsManager
    const IsVisible = ref(false)
    IsVisible.value = token.IsVisible
    const IsKeyUser = ref(false)
    IsKeyUser.value = token.IsKeyUser
    const IsCreated = ref(false)
    IsCreated.value = token.IsCreated
    const activeIndexValue = ref(0)
    const activeValue = ref(0)
    const tabview1 = ref(null)
    const sendsTableLength = ref(0);
    const incomingTableLength = ref(0);
    const relevantTableLength = ref(0);
    const publicIssueTableLength = ref(0);
    watch(()=>activeIndexValue.value,(value)=>{
      activeValue.value = value
    })

   // root.$nextTick(() => {renderComponent.value = true;});


    const newIssue = () => {
      router.push("/issueCreate")
    }
    const IssueSendLength = (data) => {
      sendsTableLength.value = data
    }
    const publicIssueTable = (data) => {
      publicIssueTableLength.value = data
    }
    const IncomingDataTableLength = (data) => {
      incomingTableLength.value = data
    }
    const relevantTable = (data) => {
      relevantTableLength.value = data
    }
    const logOut = () => {
      localStorage.removeItem('token');
      router.push("/login")
      toast.add({severity: 'success', summary: 'Başarılı', detail: 'Çıkış Yapıldı', life: 3000});

    }

    return {
      logOut, newIssue,renderComponent,reRender,plus,IsManager,activeIndexValue,activeValue,tabview1,
      IssueSendLength,sendsTableLength,IncomingDataTableLength,incomingTableLength,relevantTableLength,relevantTable
      ,IsVisible,publicIssueTableLength,publicIssueTable,IsKeyUser,IsCreated


    }
  }
}

</script>

<style scoped>
.shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  width: 100%;
  height: 750px;
  border: #ccc 2px solid;
  border-radius: 0.5rem

}
</style>