<template>
  <Card class="col-12 mb-3 cardColor4" style="border-radius: 0.8rem">

    <template #title>

      <div style=" height: 0px ">
        <h6 style="text-align: center">AKIŞ BİLGİLERİ</h6>

      </div>

    </template>
    <template #content>
      <div style="margin-top: 20px">
        <Accordion :activeIndex="[0]" :multiple="true">
          <AccordionTab v-for="activity in IssueActivityInfos" :key="activity.Id" :header="activity.SubActivityTitle">
            <header2
                v-model:IssueActivityDetailInfos="activity.IssueActivityDetailInfos"
            ></header2>
          </AccordionTab>
        </Accordion>
        <Button @click="addActivity">Alternatif Akış Ekle</Button>
      </div>
    </template>
  </Card>
</template>
<script>

import {ref, toRefs} from "vue";
import Header2 from "./StreamListComponents/Header2";

export default {
  components: {Header2},
  emits: ['streamList'],
  props: {
    IssueActivityInfos: {
      type: Array,
      default: () => []
    },
  },

  setup(props) {
    const index = ref(0);
    const state = ref([{}]);
    const Departments = ref([]);
    const detailInfos = ref([])

    const {IssueActivityInfos} = toRefs(props)

    console.log("maplenmeden önce", IssueActivityInfos.value)


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