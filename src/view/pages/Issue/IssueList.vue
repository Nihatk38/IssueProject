<template>
  <div>
    <div class="card">
      <h5>Konu Listesi</h5>
      <Button label="Yeni Konu Oluştur" class="p-button-success p-button-outlined mb-2" icon="pi pi-plus"
              @click="newIssue"></Button>
      <TabView ref="tabview1">
        <TabPanel header="Bana Gelenler">
          <issue-incoming></issue-incoming>
        </TabPanel>
        <TabPanel header="Benim Yazdıklarım">
          <issue-send></issue-send>
        </TabPanel>
      </TabView>
    </div>
  </div>

</template>

<script>

import IssueSend from "../../../components/Issue/IssueSend";
import IssueIncoming from "../../../components/Issue/IssueIncoming";
import {useToast} from "primevue/usetoast";
import router from "../../../router";

export default {
  components: {IssueIncoming, IssueSend},
  setup() {
    const toast = useToast()
    const newIssue = () => {
      router.push("/issueCreate")
    }
    const logOut = () => {
      localStorage.removeItem('token');
      router.push("/login")
      toast.add({severity: 'success', summary: 'Başarılı', detail: 'Çıkış Yapıldı', life: 3000});

    }

    return {
      logOut, newIssue


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