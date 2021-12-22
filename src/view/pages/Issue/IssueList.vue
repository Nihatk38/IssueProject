<template>
  <div >
    <div class="card">
      <div class="p-card-title flex justify-content-between">
        <h5>Konu Listesi</h5>
        <Button label="Yeni Konu Oluştur" class="p-button-success p-button-outlined align-self-end"
                icon="pi pi-plus"
                @click="newIssue"></Button>
      </div>


      <TabView ref="tabview1">
        <TabPanel header="Bana Gelenler">
          <issue-incoming :key="renderComponent" ></issue-incoming>
        </TabPanel>
        <TabPanel header="Benim Yazdıklarım">
          <issue-send :key="renderComponent"  ></issue-send>
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
import {ref, onMounted} from "vue";

export default {
  components: {IssueIncoming, IssueSend},

  setup() {
    onMounted(()=>{
      renderComponent.value+=1
    })
    const toast = useToast()

    const reRender=ref(false);

    const renderComponent=ref(0)

    console.log("render",renderComponent.value)
   // root.$nextTick(() => {renderComponent.value = true;});


    const newIssue = () => {
      router.push("/issueCreate")
    }

    const logOut = () => {
      localStorage.removeItem('token');
      router.push("/login")
      toast.add({severity: 'success', summary: 'Başarılı', detail: 'Çıkış Yapıldı', life: 3000});

    }

    return {
      logOut, newIssue,renderComponent,reRender


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