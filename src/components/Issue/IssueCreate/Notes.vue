<template>
  <div class="card mb-3 cardColor1 border-round">

    <div class="p-card-title relative">
      <h5 class="text-center mb-4">NOTLAR</h5>
      <Button class="p-button-text absolute top-0 left-0" icon="pi pi-plus" type="button" @click="createNote "
              label="Not Ekle" :disabled="status >0 && status <9"/>
    </div>


    <DataTable :value="noteList"
               dataKey="LineNo" selectionMode="single"
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
        <Button class="p-button-text" icon="pi pi-times" label="İptal" @click="createNoteDialog=false"/>
        <Button class="p-button-text" icon="pi pi-check" label="Kaydet" @click="saveNotes"/>
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

    const {noteList} = toRefs(props)
    const newExplanation = ref('')
    const keyIndex = ref(0)


    const cm = ref()
    const menuModel = ref([
      {
        label: "Sil",
        icon: "pi pi-trash",
        command: () => {
          deleteNote(selected)
        }
      }
    ])

    const createNote = () => {
      createNoteDialog.value = true
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
      if (noteList.value.length > 0) {
        keyIndex.value = noteList.value.length
      }
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
      selected, createNoteDialog, createNote, saveNotes, newExplanation, deleteNote, menuModel, cm, onRowContextMenu
    }
  }
}
</script>

<style scoped>

</style>