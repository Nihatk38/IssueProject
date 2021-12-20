<template>
  <div class="card mb-3 cardColor2 border-round">

    <div class="p-card-title relative">
      <h5 class="text-center mb-4">AKIŞ BİLGİLERİ</h5>
      <Button class="p-button-text absolute top-0 left-0" icon="pi pi-plus" type="button" @click="addActivity "
              label="Alternatif Akış Ekle"/>
    </div>

    <div class="p-card-body">
      <Accordion :activeIndex="[0]" :multiple="true">
        <AccordionTab v-for="activity in IssueActivityInfos" :key="activity.Id" :header="activity.SubActivityTitle">
          <ActivityInfo
              v-model:IssueActivityDetailInfos="activity.IssueActivityDetailInfos"
          ></ActivityInfo>
        </AccordionTab>
      </Accordion>
    </div>
  </div>
</template>

<script>

import {ref, toRefs} from "vue";
import ActivityInfo from "./ActivityInfo";

export default {
  components: {ActivityInfo},
  emits: ['streamList'],
  props: {
    IssueActivityInfos: {
      type: Array,
      default: () => []
    },
  },

  setup(props) {
    const {IssueActivityInfos} = toRefs(props)

    const index = ref(0);
    const state = ref([{}]);
    const Departments = ref([]);
    const detailInfos = ref([])


    if (!IssueActivityInfos.value.length)
      IssueActivityInfos.value.push({
        Type: 1,
        SubActivityNo: ++index.value,
        SubActivityTitle: "Temel Akıs",
        IssueActivityDetailInfos: [],
      });

    const addActivity = () => {
      IssueActivityInfos.value.push({
        Type: 2,
        SubActivityNo: ++index.value,
        SubActivityTitle: "Alternatif Akıs " + index.value,
        IssueActivityDetailInfos: []
      });
    };

    return {

      state, Departments, index, detailInfos,

      addActivity
    }
  }
}
</script>

<style scoped>


</style>