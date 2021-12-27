<template>
  <div class="card mb-3 cardColor1 border-round">

    <div class="p-card-title relative">
      <h5 class="text-center mb-4">NOTLAR</h5>
      <Button class="p-button-text absolute top-0 left-0" icon="pi pi-plus" type="button" @click="createNote "
              label="Not Ekle" :disabled="status >0 && status <9"/>
    </div>


    <DataTable :value="noteList"
               dataKey="LineNo" selectionMode="single"
               v-model:selection="selected"
               contextMenu v-model:contextMenuSelection="selected" @rowContextmenu="onRowContextMenu"
               responsiveLayout="scroll"
               showGridlines
    >

      <template #empty>
        Kayıt bulunamadı
      </template>

      <Column field="LineNo" header="S.No">

        <template #body="{data}">
          {{ data.LineNo }}
        </template>
      </Column>

      <Column field="Explanation" header="Açıklama">

        <template #body="{data}">
          {{ data.Explanation }}

        </template>

      </Column>


    </DataTable>

    <contextMenu :model="menuModel" ref="cm"/>


    <Dialog v-model:visible="createNoteDialog" :modal="true" :style="{width: '800px'}" :visible="true"
            class="p-fluid" header="Yeni Not Oluştur">


      <div class="p-field">
        <label for="Explanation">Not</label>
        <Textarea id="Explanation" v-model="newExplanation" maxLength="2000" cols="50" rows="5"/>
      </div>


      <template #footer>
        <Button class="p-button-text" icon="pi pi-times" label="İptal" @click="cancelButton"/>
        <Button v-if="updateButton" class="p-button-text" icon="pi pi-check" label="Güncelle" @click="selectedUpdate"/>
        <Button v-else class="p-button-text" icon="pi pi-check" label="Kaydet" @click="saveNotes"/>
      </template>
    </Dialog>

  </div>
</template>

<script>
import {ref, toRefs} from "vue";


export default {
  props: {
    noteList: {
      type: Array,
      default: () => []
    },
    status:{
      type:Number
    }
  },
  setup(props) {
    const selected = ref(null)
    const createNoteDialog = ref(false)
    const updateButton = ref(false)
    const {noteList} = toRefs(props)
    const newExplanation = ref('')
    const keyIndex = ref(0)


    const cm = ref()
    const menuModel = ref([
      {
        label: "Düzelt",
        icon:"pi pi-pencil",
        command: () => {
          openUpdateDialog()
        }
      },
      {
        label: "Sil",
        icon: "pi pi-trash",
        command: () => {
          deleteNote(selected)
        }
      }
    ])
    const cancelButton = () => {
      createNoteDialog.value = false
      updateButton.value = false
      newExplanation.value = ''
    }
    const createNote = () => {
      createNoteDialog.value = true
    }
    const openUpdateDialog = () => {
      newExplanation.value = selected.value.Explanation
      updateButton.value = true
      createNote()

    }
    const selectedUpdate = () => {
      noteList.value[selected.value.LineNo - 1].Explanation = newExplanation.value

      cancelButton()
    }
    const deleteNote = () => {
      noteList.value.splice(noteList.value.indexOf(selected.value), 1)
      selected.value = null

      keyIndex.value = 0;
      noteList.value.forEach((note) => {
        note.LineNo = ++keyIndex.value;
      });
    }

    const saveNotes = () => {
     /* if (noteList.value.length > 0) {
        keyIndex.value = noteList.value.length
      }*/
      keyIndex.value += 1
      noteList.value.push({
        Explanation: newExplanation.value,
        LineNo: parseInt(keyIndex.value)
      })
      newExplanation.value = ''
      createNoteDialog.value = false
    }

    const onRowContextMenu = (event) => {
      if(props.status >0)
        return
      cm.value.show(event.originalEvent)
    }

    return {
      selected,
      updateButton,
      createNoteDialog,
      createNote,
      saveNotes,
      newExplanation,
      deleteNote,
      menuModel,
      cm,
      cancelButton,
      onRowContextMenu,
      openUpdateDialog,
      selectedUpdate
    }
  }
}
</script>

<style scoped>

</style>