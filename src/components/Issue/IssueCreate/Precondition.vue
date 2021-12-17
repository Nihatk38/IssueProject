<template>
  <Card class="col-12 mb-3 cardColor3" style="border-radius: 0.8rem">

    <template #title>

      <div style=" height: 0px ">
        <h6 style="text-align: center">ÖN KOŞUL BİLGİLERİ</h6>

      </div>
      <Button class=" p-button-success mr-2 p-button-outlined" icon="pi pi-plus"
              style="border-radius: 0.5rem"
              type="button" @click="openPrecondition "/>

    </template>
    <template #content>


      <DataTable v-model:selection="selectedPrecondition" contextMenu @rowContextmenu="onRowContextMenu" :modal="true" :scrollable="true" :value="preconditionList"

                 class="p-datatable-preconditionList"
                 dataKey="LineNo" responsiveLayout="scroll" scrollHeight="flex" selectionMode="single"
                 showGridlines>

        <template #empty>
          Bir sonuç bulunamadı...
        </template>

        <Column field="LineNo" header="S.No">

          <template #body="{data}" >
            {{ data.LineNo }}
          </template>
        </Column>
        <Column field="Precondition" header="Ön Koşullar" >

          <template #body="{data}">
            {{ data.Explanation }}
          </template>
        </Column>



      </DataTable>
      <ContextMenu :model="menuModel" ref="cm" />


      <Dialog v-model:visible="preconditionCreateDialog" :modal="true" :style="{width: '800px'}" :visible="true"
              class="p-fluid" header="Yeni Ön Koşul Oluştur">


        <div class="p-field">
          <label for="Precondition">Ön koşul</label>
          <Textarea id="Precondition" v-model="newPrecondition" maxLength="2000"/>
        </div>


        <template #footer>
          <Button class="p-button-text" icon="pi pi-times" label="İptal" @click="preconditionCreateDialog=false"/>
          <Button class="p-button-text" icon="pi pi-check" label="Kaydet" @click="savePrecondition"/>
        </template>
      </Dialog>


    </template>
  </Card>
</template>
<script>
import {toRefs,ref} from "vue";

export default {
  props:{
    preconditionList: {
      type: Array,
      default: () => []
    }
  },
  setup(props){
    const cm=ref()

    const selectedPrecondition=ref(null)
    const preconditionCreateDialog=ref(false)

    const {preconditionList}=toRefs(props)

    const state=ref([{

    }])
    const newPrecondition=ref('')

    const menuModel =ref( [
      {
        label:"Sil",
        icon:"pi pi-trash",
        command:()=>{
          deletePrecondition(selectedPrecondition)
    }
      },

      {
        label:"Kapat",
        icon:"pi pi-power-off"
      },
    ])

    const onRowContextMenu = (event) => {
      cm.value.show(event.originalEvent);
    };


    const openPrecondition =() =>{
     preconditionCreateDialog.value=true
    }
    const keyIndex=ref(0)

    const savePrecondition = () =>{
      keyIndex.value+=1;
     preconditionList.value.push({
       Explanation: newPrecondition.value,
       LineNo:parseInt(keyIndex.value)
     })
      newPrecondition.value=''
      preconditionCreateDialog.value=false
    }
    const deletePrecondition=()=>{
      preconditionList.value.splice(preconditionList.value.indexOf(selectedPrecondition.value),1)
      selectedPrecondition.value=null

      keyIndex.value = 0;
      preconditionList.value.forEach((note) => {
        note.LineNo = ++keyIndex.value;
      });


    }

    return{
      selectedPrecondition,preconditionCreateDialog,state,openPrecondition,newPrecondition,savePrecondition,deletePrecondition,menuModel,cm,onRowContextMenu
    }
  }
}
</script>

<style scoped>


</style>