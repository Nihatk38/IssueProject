<template>
  <div class="card mb-3 cardColor1 border-round">

    <div class="p-card-title relative">
      <h5 class="text-center mb-4">ÖN KOŞUL BİLGİLERİ</h5>
      <Button class="p-button-text absolute top-0 left-0" icon="pi pi-plus" type="button" @click="openUpdateDialog "
              label="Ön Koşul Ekle" :disabled="status >0 && status <9"/>
    </div>


    <DataTable :value="preconditionList"
               dataKey="LineNo" selectionMode="single"
               v-model:selection="selectedPrecondition"
               contextMenu v-model:contextMenuSelection="selectedPrecondition" @rowContextmenu="onRowContextMenu"
               responsiveLayout="scroll"
               showGridlines>

      <template #empty>
        Kayıt bulunamadı
      </template>

      <Column field="LineNo" header="S.No">

        <template #body="{data}">
          {{ data.LineNo }}
        </template>
      </Column>
      <Column field="Precondition" header="Ön Koşullar">

        <template #body="{data}">
          {{ data.Explanation }}
        </template>
      </Column>


    </DataTable>

    <ContextMenu :model="menuModel" ref="cm"/>


    <Dialog v-model:visible="preconditionCreateDialog" :modal="true" :style="{width: '800px'}" :visible="true"
            class="p-fluid" header="Yeni Ön Koşul Oluştur">


      <div class="p-field">
        <label for="Precondition">Ön koşul</label>
        <Textarea id="Precondition" v-model="newPrecondition" maxLength="2000"/>
      </div>


      <template #footer>
        <Button class="p-button-text" icon="pi pi-times" label="İptal" @click="cancelButton"/>
        <Button v-if="updateButton" class="p-button-text" icon="pi pi-check" label="Güncelle"
                @click="updateSelected"/>

        <Button v-else class="p-button-text" icon="pi pi-check" label="Kaydet" @click="savePrecondition"/>
      </template>
    </Dialog>


  </div>
</template>
<script>
import {toRefs, ref} from "vue";

export default {
  props: {
    preconditionList: {
      type: Array,
      default: () => []
    },
    status:{
      type:Number
    }
  },
  setup(props) {
    const {preconditionList} = toRefs(props)
    const updateButton = ref(false)
    const keyIndex = ref(0)
    const selectedPrecondition = ref(null)
    const preconditionCreateDialog = ref(false)

    const state = ref([{}])
    const newPrecondition = ref('')

    const cm = ref()
    const menuModel = ref([
      {
        label: "Düzelt",
        icon:"pi pi-pencil",
        command: () => {
          updatePrecondition()
        }

      },
      {
        label: "Sil",
        icon: "pi pi-trash",
        command: () => {
          deletePrecondition(selectedPrecondition)
        }
      }
    ])

    const onRowContextMenu = (event) => {
      if(props.status >0)
        return
      cm.value.show(event.originalEvent);
    };

    const openUpdateDialog = () => {
      preconditionCreateDialog.value = true
      //   selectedPrecondition.value = []
    }
    const updatePrecondition = () => {
      newPrecondition.value = selectedPrecondition.value.Explanation
      updateButton.value = true
      openUpdateDialog()
    }
    const updateSelected = () => {
      preconditionList.value[selectedPrecondition.value.LineNo - 1].Explanation = newPrecondition.value,
          cancelButton()
    }
    const cancelButton = () => {
      preconditionCreateDialog.value = false
      updateButton.value = false
      newPrecondition.value = ''
    }
    const savePrecondition = () => {
      if (preconditionList.value.length > 0) {
        keyIndex.value = preconditionList.value.length
      }
      keyIndex.value += 1;
      preconditionList.value.push({
        Explanation: newPrecondition.value,
        LineNo: parseInt(keyIndex.value)
      })
      newPrecondition.value = ''
      preconditionCreateDialog.value = false
    }

    const deletePrecondition = () => {
      preconditionList.value.splice(preconditionList.value.indexOf(selectedPrecondition.value), 1)
      selectedPrecondition.value = null

      keyIndex.value = 0;
      preconditionList.value.forEach((note) => {
        note.LineNo = ++keyIndex.value;
      });
    }

    return {
      updateButton,
      selectedPrecondition,
      preconditionCreateDialog,
      state,
      openUpdateDialog,
      newPrecondition,
      savePrecondition,
      deletePrecondition,
      menuModel,
      cm,
      cancelButton,
      onRowContextMenu,
      updateSelected,
      updatePrecondition
    }
  }
}
</script>

<style scoped>


</style>