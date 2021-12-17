<template>
  <Card class="col-12 mb-3 cardColor1" style="border-radius: 0.8rem">

    <template #title>

      <div style=" height: 0px ">
        <h6 style="text-align: center">NOT BİLGİLERİ</h6>

      </div>
      <Button class=" p-button-success mr-2 p-button-outlined" icon="pi pi-plus"
              style="border-radius: 0.5rem"
              type="button" @click="createNote "/>

    </template>
    <template #content>

      <DataTable  v-model:selection="selected" selectionMode="single" contextMenu @rowContextmenu="onRowContextMenu" :modal="true" dataKey="LineNo"   :scrollable="true"
                 scrollHeight="flex" :value="noteList"
                 class="p-datatable-notes"
               >

        <template #empty>
          Bir sonuç bulunamadı...
        </template>

        <Column field="LineNo" header="S.No">

          <template #body="{data}">
            {{ data.LineNo }}
          </template>
        </Column>

        <Column field="Explanation" header="Açıklama">

          <template #body="{data}">
            {{data.Explanation}}

          </template>

        </Column>


      </DataTable>
      <contextMenu :model="menuModel" ref="cm"/>




      <Dialog v-model:visible="createNoteDialog" :modal="true" :style="{width: '450px'}" :visible="true"
              class="p-fluid" header="Yeni Not Oluştur">


        <div class="p-field">
          <label for="Explanation">Not</label>
          <Textarea id="Explanation" v-model="newExplanation" maxLength="2000"/>
        </div>


        <template #footer>
          <Button class="p-button-text" icon="pi pi-times" label="İptal" @click="createNoteDialog=false"/>
          <Button class="p-button-text" icon="pi pi-check" label="Kaydet" @click="saveNotes"/>
        </template>
      </Dialog>

    </template>
  </Card>
</template>
<script>
import {ref, toRefs} from "vue";


export default {
  props:{
    noteList:{
      type:Array,
      default:()=>[]
    }
  },
  setup(props){
    const selected=ref(null)
    const createNoteDialog=ref(false)

    const {noteList}=toRefs(props)
    const newExplanation=ref('')
    const keyIndex=ref(0)


    const cm=ref()
    const menuModel=ref([
      {label:"Sil",
        icon:"pi pi-trash",
        command:()=>{
        deleteNote(selected)
        }
      },
      {
        label:"Kapat",
        icon:"pi pi-power-off"
      }

    ])
   const onRowContextMenu=(event)=>{
      cm.value.show(event.originalEvent)
    }

    const createNote=() =>{
    createNoteDialog.value=true
    }

    const deleteNote=()=>{
      noteList.value.splice(noteList.value.indexOf(selected.value),1)
      selected.value=null

      keyIndex.value = 0;
      noteList.value.forEach((note) => {
        note.LineNo = ++keyIndex.value;
      });
    }

    const saveNotes= () =>{
      keyIndex.value+=1
      noteList.value.push({
        Explanation:newExplanation.value,
        LineNo:parseInt(keyIndex.value)
      })
      newExplanation.value=''
      createNoteDialog.value=false
    }

    return{
      selected,createNoteDialog,createNote,saveNotes,newExplanation,deleteNote,menuModel,cm,onRowContextMenu
    }
  }
}
</script>

<style scoped>

</style>