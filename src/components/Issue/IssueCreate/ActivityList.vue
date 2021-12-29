<template>
  <div class="card mb-3 cardColor2 border-round">

    <div class="p-card-title relative">
      <h5 class="text-center mb-4">AKIŞ BİLGİLERİ</h5>

    </div>
    <slot name="activitiyinfos"></slot>
    <!--    <div v-if="(v$.IssueActivityInfos.$invalid && submitted && !activityInfoSubmitted )" class="p-error mb-2">Temel Akış
          Boş Bırakılamaz.
        </div>-->
    <div class="p-card-body">
      <Accordion :activeIndex="accordionIndex" :multiple="false">
        <AccordionTab v-for="activity in IssueActivityInfos" :key="activity.SubActivityNo"
                      class="justify-content-between">
          <template #header>
            <div class="flex align-items-center w-full">
              {{ activity.SubActivityTitle }}<span style="color: red"> *</span>
              <div class="flex-1 text-right">
                <Button class="p-button-info p-button-outlined mr-1" icon="pi pi-copy"
                        :disabled="status>0 && status<9 " @click.stop="copyActivity(activity)"/>
                <Button v-if="activity.Type !== 1" class="p-button-danger p-button-outlined " icon="pi pi-times"
                        :disabled="status>0 && status<9 " @click.stop="deleteActivity(activity)"/>
              </div>
            </div>

          </template>

          <ActivityInfo
              v-model:IssueActivityDetailInfos="activity.IssueActivityDetailInfos"
              :status="status"
          ></ActivityInfo>

        </AccordionTab>
      </Accordion>
      <div class="w-full text-center mt-2">
        <Button class="p-button-text" icon="pi pi-plus" type="button" @click="addActivity "
                :disabled="status>0 && status<9 "
                label="Alternatif Akış Ekle"/>
      </div>
    </div>
  </div>
</template>

<script>

import {ref, toRefs} from "vue";
import ActivityInfo from "./ActivityInfo";
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";

export default {
  components: {ActivityInfo},
  emits: ['streamList'],
  props: {
    IssueActivityInfos: {
      type: Array,
      default: () => []
    },
    status: {
      type: Number,

    },
    submitted: {
      type: Boolean
    }
  },

  setup(props) {
    const {IssueActivityInfos} = toRefs(props)
    const confirm = useConfirm()
    const index = ref(0);
    const accordionIndex = ref(0);
    const state = ref([{}]);
    const Departments = ref([]);
    const selected = ref()
    const detailInfos = ref([])
    const activityInfoSubmitted = ref(false)
    const toast = useToast()

    if (!IssueActivityInfos.value.length)
      IssueActivityInfos.value.push({
        Type: 1,
        SubActivityNo: ++index.value,
        SubActivityTitle: "Temel Akıs",
        IssueActivityDetailInfos: [],
      });

    function reorderActivityNo() {
      index.value = 1;
      IssueActivityInfos.value.forEach((activty) => {
        activty.SubActivityTitle = activty.Type === 1 ? "Temel Akıs" : ("Alternatif Akıs " + ++index.value);
        activty.SubActivityNo = index.value;
      });
    }

    const addActivity = () => {
      IssueActivityInfos.value.push({
        Type: 2,
        SubActivityNo: ++index.value,
        SubActivityTitle: "Alternatif Akıs " + index.value,
        IssueActivityDetailInfos: []
      });
      accordionIndex.value++;
    };

    const copyActivity = (activity) => {
      const newActivity = {...activity, Id: 0, Type: 2};
      IssueActivityInfos.value.push(newActivity);
      reorderActivityNo();

      accordionIndex.value++;
    };

    const deleteActivity = (activity) => {
      confirm.require({
        message: "Akışı silmek isteediğinizden emin misiniz?",
        header: "Onay Ver",
        icon: "pi pi- exclamation-triangle",
        accept: () => {
          IssueActivityInfos.value.splice(IssueActivityInfos.value.indexOf(activity), 1)

          reorderActivityNo();
          accordionIndex.value = -1;
          toast.add({severity: 'warn', summary: 'Akış Silindi', detail: 'Başarılı', life: 3000});
        },
        reject: () => {
          toast.add({severity: 'error', summary: 'Akış Silinemedi', detail: 'Başarısız', life: 3000});
        }
      })
    }


    return {

      state, Departments, index, detailInfos, activityInfoSubmitted, accordionIndex,

      addActivity, copyActivity, deleteActivity, selected
    }
  }
}
</script>

<style scoped>


</style>