<template>
  <div class="card mb-3 cardColor2 border-round">

    <div class="p-card-title relative">
      <h5 class="text-center mb-4">AKIŞ BİLGİLERİ</h5>
      <Button class="p-button-text absolute top-0 left-0" icon="pi pi-plus" type="button" @click="addActivity "
              label="Alternatif Akış Ekle" :disabled="status >0"/>
    </div>
    <div  v-if="(v$.IssueActivityInfos.$invalid && submitted && !activityInfoSubmitted )" class="p-error mb-2">Temel Akış Boş Bırakılamaz.</div>
    <div class="p-card-body">
      <Accordion :activeIndex="[0]" :multiple="true">
        <AccordionTab v-for="activity in IssueActivityInfos" :key="activity.Id" :header="activity.SubActivityTitle">
          <ActivityInfo
              v-model:IssueActivityDetailInfos="activity.IssueActivityDetailInfos"
              :status="status"
              @submitted="clicked"
          ></ActivityInfo>
        </AccordionTab>
      </Accordion>
    </div>
  </div>
</template>

<script>

import {ref, toRefs} from "vue";
import ActivityInfo from "./ActivityInfo";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  components: {ActivityInfo},
  emits: ['streamList'],
  props: {
    IssueActivityInfos: {
      type: Array,
      default: () => []
    },
    status:{
      type:Number,

    },
  submitted:{
      type:Boolean
  }
  },

  setup(props) {
    const {IssueActivityInfos} = toRefs(props)

    const index = ref(0);
    const state = ref([{}]);
    const Departments = ref([]);
    const detailInfos = ref([])
    const activityInfoSubmitted=ref(false)
    const rules = {
      IssueActivityInfos: {required}
    }
    const clicked=(submitted) =>{
    activityInfoSubmitted.value = submitted
    }
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
    const v$ = useVuelidate(rules, IssueActivityInfos.value)
    return {

      state, Departments, index, detailInfos,rules,v$,clicked,activityInfoSubmitted,

      addActivity
    }
  }
}
</script>

<style scoped>


</style>