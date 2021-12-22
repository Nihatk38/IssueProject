<template>

  <TreeTable :value="nodes" filterDisplay="menu" selectionMode="single"
             contextMenu @contextmenu="onRowContextMenu"
             @nodeSelect="onNodeSelect" @nodeUnselect="onNodeUnselect">
    <template #empty>
      Kayıt bulunamadı
    </template>

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
        {{ resultRoles.find(role => role.Id === data.node.data.RoleId)?.Definition ?? "" }}
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


  </TreeTable>

  <ContextMenu :model="menuModel" ref="cm"/>


  <Dialog v-model:visible="createNoteDialog" :modal="true" :style="{width: '800px'}" :visible="true"
          class="p-fluid" header="Yeni Akış Oluştur">

    <div class="p-field">
      <label for="Definition">Tanım</label>
      <Textarea id="Definition" v-model="activity.Definition" :auto-resize="true" maxLength="2000"/>
      <small v-if="(v$.Definition.$invalid && submitted)" class="p-error">Tanım Boş Bırakılamaz.</small>
    </div>

    <div class="p-field">
      <label for="RoleId">Rol</label>
      <Dropdown v-model="activity.RoleId" :options="resultRoles" optionLabel="Definition" optionValue="Id"/>
      <small v-if="(v$.RoleId.$invalid && submitted)" class="p-error">Rol Boş Bırakılamaz.</small>
    </div>

    <div class="p-field">
      <label for="Medium">Ortam</label>
      <InputText id="Precondition" v-model="activity.Medium" :auto-resize="true"/>
      <small v-if="(v$.Medium.$invalid && submitted)" class="p-error">Ortam Bilgisi Boş Bırakılamaz.</small>
    </div>

    <div class="p-field">
      <label for="Explanation">Açıklama</label>
      <Textarea id="Definition" v-model="activity.Explanation" :auto-resize="true" maxLength="2000"/>
      <small v-if="(v$.Explanation.$invalid && submitted)" class="p-error">Açıklama Bırakılamaz.</small>
    </div>


    <template #footer>
      <Button class="p-button-text" icon="pi pi-times" label="İptal" @click="createNoteDialog=false"/>
      <Button class="p-button-text" icon="pi pi-check" label="Kaydet" @click="saveNotes()"/>
    </template>
  </Dialog>

</template>

<script>
import {computed, onMounted, ref, watch} from "vue";
import UsersService from "@/service/users.service";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
  props: {
    Header: {
      type: String,
      default: ""
    },
    IssueActivityDetailInfos: {
      type: Array,
      default: () => []
    },
    status:{
      type:Number
    },

  },
  emits:['submitted'],
  setup(props, {emit}) {

    const nodes = ref([])
    const indexNum = ref(null)
    const createNoteDialog = ref(false)
    const selectedNode = ref(null)
    const parentNode = ref(null)
    const activity = ref({})
    const resultRoles = ref([])
    const childIndex = ref(0);
    const keyIndex = ref(0)
    const submitted=ref(false)
    const cm = ref()
    const rules = {
      Definition: {required},
      RoleId: {required},
      Medium: {required},
      Explanation: {required},
    }
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
          addDetail(null)
        },
        disabled: props.status>0
      },
      {
        label: "Alt Detay Ekle",
        icon: "pi pi-plus",
        disabled: computed(() => selectedNode.value == null  ),
        command: () => {
          addDetail(selectedNode.value)
        }
      },
      {
        separator: true
      },
      {
        label: "Seçileni Sil",
        icon: "pi pi-trash",
        disabled: computed(() => selectedNode.value == null),
        command: () => {
          deleteNode(selectedNode.value)
        }
      }
    ])

    const createNote = () => {
      createNoteDialog.value = true
    }

    const addDetail = (node) => {
      parentNode.value = node
      createNoteDialog.value = true
    };

    const findParent = (parent, index) => {
      if (parent.Index === index)
        return parent;

      for (let i = 0; i < parent.IssueActivityDetailInfos.length; i++) {
        const child = parent.IssueActivityDetailInfos[i];

        if (child.Index === index) {
          return parent;
        }

        if (child.IssueActivityDetailInfos.length > 0)
          return findParent(child, index);
      }
    }

    const findByProperty = (obj, predicate) => {
      if (predicate(obj)) return obj
      for (let n of Object.values(obj).filter(Boolean).filter(v => typeof v === 'object')) {
        let found = findByProperty(n, predicate)
        if (found) return found
      }
    }

    const deleteNode = (node) => {
      if (!node) return;

      let detailsInfo = [...props.IssueActivityDetailInfos];

      let foundItem = findByProperty(detailsInfo, val => val.Index === node.data.Index);

      const parentIndex = detailsInfo.indexOf(foundItem);
      if (parentIndex >= 0)
        detailsInfo.splice(parentIndex, 1);
      else {

        let foundParent = null;

        for (let i = 0; i < detailsInfo.length; i++) {
          const detail = detailsInfo[i];
          foundParent = findParent(detail, node.data.Index);
          if (foundParent)
            break;
        }

        if (foundParent) {
          foundParent.IssueActivityDetailInfos.splice(foundParent.IssueActivityDetailInfos.indexOf(foundItem), 1);
        }
      }

      emit('update:IssueActivityDetailInfos', detailsInfo);

      selectedNode.value = null;
    }

    const addNode = () => {
      submitted.value=true;
      if(!v$.value.$error){
        submitted.value=false
        emit('submitted',true)
      if (parentNode.value) {
        let detailsInfo = [...props.IssueActivityDetailInfos];

        let foundItem = findByProperty(detailsInfo, val => val.Index === parentNode.value.data.Index);

        if (foundItem) {
          foundItem.IssueActivityDetailInfos = foundItem.IssueActivityDetailInfos || [];
          foundItem.IssueActivityDetailInfos.push({
            LineNo: 0,
            Definition: activity.value.Definition,
            RoleId: activity.value.RoleId,
            Medium: activity.value.Medium,
            Explanation: activity.value.Explanation,
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
          Definition: activity.value.Definition,
          RoleId: activity.value.RoleId,
          Medium: activity.value.Medium,
          Explanation: activity.value.Explanation,
          IssueActivityDetailInfos: []
        })
        emit('update:IssueActivityDetailInfos', detailsInfo);
      }

      createNoteDialog.value = false
      activity.value = {};
      }else
        emit('submitted',false)
    }


    const onRowContextMenu = (event) => {
      if(props.status >0)
        return
      cm.value.show(event)
    }
    const onNodeSelect = (node) => {
      selectedNode.value = node;
    }
    const onNodeUnselect = () => {
      selectedNode.value = null;
    }

    onMounted(async () => {
      await UsersService.getRole()
          .then(response => {
            resultRoles.value = response.Payload
          })
    });
    const v$ = useVuelidate(rules, activity.value)
    return {
      createNoteDialog, createNote, activity, indexNum, nodes,
      saveNotes: addNode, keyIndex, addDetail, childIndex, resultRoles, deleteNote: deleteNode, cm, menuModel,
      onRowContextMenu, onNodeSelect, onNodeUnselect,rules,v$,submitted
    }
  }
}
</script>

<style scoped>

</style>