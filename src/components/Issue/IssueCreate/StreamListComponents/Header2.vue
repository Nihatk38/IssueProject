<template>
  <Card class="col-12 mb-3" style="border-radius: 0.8rem">

    <template #title>

      <Button class=" p-button-success mr-2 p-button-outlined" icon="pi pi-plus"
              style="border-radius: 0.5rem"
              type="button" @click="createNote "/>

    </template>
    <template #content>

      <TreeTable v-model:selectionKeys="selectedKey" :value="nodes" filterDisplay="menu" selectionMode="single"
                 style="background-color: #E2C2B9" @contextmenu="onRowContextMenu">

        <Column :expander="true" field="LineNo" header="Sıra No">
          <template #body="data">
            {{ data.node.data.LineNo }}
          </template>
        </Column>

        <Column field="Definition" header="Tanım">
          <template #body="data">

            {{ data.node.data.Definition }}
          </template>
        </Column>

        <Column field="RoleId" header="Rol">
          <template #body="data">
            {{ data.node.data.RoleId }}
          </template>
        </Column>

        <Column field="Medium" header="Ortam">
          <template #body="data">
            {{ data.node.data.Medium }}
          </template>
        </Column>

        <Column field="Explanation" header="Açıklama">
          <template #body="data">
            {{ data.node.data.Explanation }}
          </template>
        </Column>

        <Column>
          <template #body="slotProps">
            <Button class="p-button-success p-button-outlined" icon="pi pi-plus" type="button"
                    @click="addDetail(slotProps.node)"></Button>
            <Button class="p-button-danger p-button-outlined" icon="pi pi-times" type="button"
                    @click="deleteNote(slotProps.node)"></Button>

          </template>
        </Column>


      </TreeTable>


      <Dialog v-model:visible="createNoteDialog" :modal="true" :style="{width: '800px'}" :visible="true"
              class="p-fluid" header="Yeni Not Oluştur">


        <div class="p-field">
          <label for="Definition">Tanım</label>
          <Textarea id="Definition" v-model="state.Definition" :auto-resize="true" maxLength="2000"/>

        </div>

        <div class="p-field">
          <label for="RoleId">Rol</label>
          <Dropdown v-model="state.RoleId" :options="resultRoles" optionLabel="Definition" optionValue="Id"/>

        </div>

        <div class="p-field">
          <label for="Medium">Ortam</label>
          <InputText id="Precondition" v-model="state.Medium" :auto-resize="true"/>

        </div>

        <div class="p-field">
          <label for="Explanation">Açıklama</label>
          <Textarea id="Definition" v-model="state.Explanation" :auto-resize="true" maxLength="2000"/>

        </div>


        <template #footer>
          <Button class="p-button-text" icon="pi pi-times" label="İptal" @click="createNoteDialog=false"/>
          <Button class="p-button-text" icon="pi pi-check" label="Kaydet" @click="saveNotes()"/>
        </template>
      </Dialog>

      <!--      <contextMenu ref="cm" :model="menuModel"/>-->

    </template>
  </Card>
</template>
<script>
import {onMounted, ref, watch} from "vue";
import UsersService from "../../../../service/users.service";

export default {
  props: {
    IssueActivityDetailInfos: {
      type: Array,
      default: () => []
    }
  },

  setup(props, {emit}) {

    const nodes = ref([])
    const indexNum = ref(null)
    const createNoteDialog = ref(false)
    const selectedKey = ref(null)
    const parentNode = ref(null)
    const state = ref([{}])
    const resultRoles = ref([])
    const childIndex = ref(0);
    const keyIndex = ref(0)
    const cm = ref()

    let nodeList = [];
    let nodeIndex = 0;

    watch(() => props.IssueActivityDetailInfos, () => {
      fillData();
    })

    function fillData() {
      nodeList = [];
      nodeIndex = 0;

      let lineNo = 0;
      props.IssueActivityDetailInfos.forEach((d) => {
        nodeList.push(fillDetails(d, (++lineNo).toString(), 0));
      })

      nodes.value = nodeList;
    }

    fillData();

    function fillDetails(detail, lineNo, subLineNo) {

      detail.Index = ++nodeIndex;
      detail.LineNo = lineNo + (subLineNo > 0 ? '.' + subLineNo.toString() : '');

      let newDetail =
          {
            key: detail.LineNo,
            data: {
              Index: detail.Index,
              LineNo: detail.LineNo,
              Definition: detail.Definition,
              Explanation: detail.Explanation,
              RoleId: detail.RoleId,
              Medium: detail.Medium,
            },
            children: []
          }

      if (detail.IssueActivityDetailInfos) {
        let subLineNo2 = 0;
        detail.IssueActivityDetailInfos.forEach((childDetail) => {
          newDetail.children.push(fillDetails(childDetail, detail.LineNo, ++subLineNo2))
        });
      }

      return newDetail;
    }


    const menuModel = ref([
      {
        label: "Detay Ekle",
        icon: "pi pi-plus",
        command: () => {
          addDetail(selectedKey.value)
        }
      },
      {
        label: "Sil",
        icon: "pi pi-trash"
      },
      {
        label: "kapat",
        icon: "pi pi-power-off"
      }

    ])

    const onRowContextMenu = (event) => {
      cm.value.show(event)
    }
    const createNote = () => {
      createNoteDialog.value = true
    }

    const addDetail = (node) => {
      parentNode.value = node
      createNoteDialog.value = true
    };

    const findParent = (parent, index) => {
      console.log(parent.Index, index);
      if (parent.Index === index)
        return parent;

      for (let i = 0; i < parent.IssueActivityDetailInfos.length; i++) {
        const child = parent.IssueActivityDetailInfos[i];

        if (child.Index === index) {
          console.log("parent", parent);
          return parent;
        }

        if (child.IssueActivityDetailInfos.length > 0)
          return findParent(child, index);
      }
    }

    const findByProperty = (obj, predicate) => {
      if (predicate(obj)) return obj
      for (var n of Object.values(obj).filter(Boolean).filter(v => typeof v === 'object')) {
        let found = findByProperty(n, predicate)
        if (found) return found
      }
    }

    const deleteNote = (node) => {

      let detailsInfo = [...props.IssueActivityDetailInfos];

      let foundItem = findByProperty(detailsInfo, val => val.Index === node.data.Index);

      const parentIndex = detailsInfo.indexOf(foundItem);
      if (parentIndex >= 0)
        detailsInfo.splice(parentIndex, 1);
      else {

        console.log(foundItem);
        let foundParent = null;

        for (let i = 0; i < detailsInfo.length; i++) {
          const detail = detailsInfo[i];
          foundParent = findParent(detail, node.data.Index);
          console.log(foundParent);
          if (foundParent)
            break;
        }

        console.log(foundParent);

        if (foundParent) {
          foundParent.IssueActivityDetailInfos.splice(foundParent.IssueActivityDetailInfos.indexOf(foundItem), 1);
        }
      }

      emit('update:IssueActivityDetailInfos', detailsInfo);

      selectedKey.value = null;
    }

    const saveNotes = () => {

      if (parentNode.value) {
        let detailsInfo = [...props.IssueActivityDetailInfos];

        let foundItem = findByProperty(detailsInfo, val => val.Index === parentNode.value.data.Index);

        if (foundItem) {
          foundItem.IssueActivityDetailInfos = foundItem.IssueActivityDetailInfos || [];
          foundItem.IssueActivityDetailInfos.push({
            LineNo: 0,
            Definition: state.value.Definition,
            RoleId: state.value.RoleId,
            Medium: state.value.Medium,
            Explanation: state.value.Explanation,
            IssueActivityDetailInfos: []
          })
        }

        emit('update:IssueActivityDetailInfos', detailsInfo);

        parentNode.value = null;

      } else {

        keyIndex.value += 1;

        let detailsInfo = [...props.IssueActivityDetailInfos];
        detailsInfo.push({
          LineNo: (keyIndex.value).toString(),
          Definition: state.value.Definition,
          RoleId: state.value.RoleId,
          Medium: state.value.Medium,
          Explanation: state.value.Explanation,
          IssueActivityDetailInfos: []
        })
        emit('update:IssueActivityDetailInfos', detailsInfo);
      }

      createNoteDialog.value = false
    }

    onMounted(async () => {
      await UsersService.getRole().then(response => {
        resultRoles.value = response.Payload
        console.log("departman tablosu", response)
      })
    });

    return {
      createNoteDialog, createNote, state, indexNum, nodes,
      saveNotes, keyIndex, selectedKey, addDetail, childIndex, resultRoles, deleteNote, cm, menuModel, onRowContextMenu
    }
  }
}
</script>

<style scoped>

</style>