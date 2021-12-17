<template>

    <Dialog  :visible="true" :modal="true" :style="{width: '450px'}" header="Yeni Kullanıcı Oluştur"
    class="p-fluid">

        <form class="p-fluid" @submit.prevent="saveUser(!v$.$invalid)">

          <div class="field">
            <label for="Id">Sicil Numarası*</label>
            <InputNumber :disabled="operation===2" id="Id"  v-model="v$.Id.$model"  autofocus  mode="decimal" :useGrouping="false"
                         :class="{'p-invalid':v$.Id.$invalid && submitted}" type="text" />
            <small v-if="(v$.Id.$invalid && submitted)" class="p-error">Sicil Numarası Boş Bırakılamaz.</small>
          </div>



          <div class="field">
            <label for="FullName">Ad Soyad*</label>
            <InputText id="FullName" v-model="v$.FullName.$model"  autofocus
                       :class="{'p-invalid':v$.FullName.$invalid && submitted}" type="text" maxlength="30"/>
            <small class="p-error" v-if="(v$.FullName.$invalid && submitted)" >Ad Soyad Boş Bırakılamaz.</small>
          </div>


          <div class="field">
            <label for="EmailAddress">E-Posta*</label>
            <InputText id="EmailAddress" v-model="v$.EmailAddress.$model" autofocus
                       :class="{'p-invalid':v$.EmailAddress.$invalid && submitted}"/>
            <small class="p-error" v-if="(v$.EmailAddress.$invalid && submitted)">E-Posta Boş Bırakılamaz.</small>
          </div>


                  <div class="field">
                     <label for="DepartmentId">Departman*</label>
                     <Dropdown v-model="v$.DepartmentId.$model" :options="resultDepartment" optionValue="Id" optionLabel="Definition"
                               :class="{'p-invalid':v$.DepartmentId.$invalid && submitted}"/>
                     <small class="p-error" v-if="(v$.DepartmentId.$invalid && submitted)">Departman Boş Bırakılamaz.</small>
                   </div>

          <div class="field">
                 <label for="IsManager">Yönetici Amir*</label>

               <div class="card border-noround" :class="{'p-invalid':v$.IsManager.$invalid && submitted}">
                 <div class="grid" >
                   <div class="col-3">
                 <RadioButton v-model="v$.IsManager.$model" name="state.IsManager" :value=1 />
                 <label for="IsManager">Evet</label>
                   </div>
                   <div class="col-3">
                 <RadioButton  :value=0 name="state.IsManager" v-model="v$.IsManager.$model" />
                 <label for="IsManager">Hayır</label>
                   </div>
                 </div>
               </div>
            <small class="p-error" v-if="(v$.IsManager.$invalid && submitted)">Kullanıcının Mevkisini Belirlemek Zorundasınız.</small>
          </div>

          <div class="field">
            <label for="IsKeyUser">Anahtar Kullanıcı*</label>

            <div class="card border-noround" :class="{'p-invalid':v$.IsKeyUser.$invalid && submitted}">
              <div class="grid" >
                <div class="col-3">
                  <RadioButton v-model="v$.IsKeyUser.$model" name="state.IsKeyUser" :value=1 />
                  <label for="IsKeyUser">Evet</label>
                </div>
                <div class="col-3">
                  <RadioButton  :value=0 name="state.IsKeyUser" v-model="v$.IsKeyUser.$model" />
                  <label for="IsKeyUser">Hayır</label>
                </div>
              </div>
            </div>
            <small class="p-error" v-if="(v$.IsKeyUser.$invalid && submitted)">Kullanıcının Mevkisini Belirlemek Zorundasınız.</small>
          </div>


          <div class="field">
              <label for="RoleName">Rol*</label>
              <Dropdown v-model="v$.RoleId.$model" :options="resultRole" optionValue="Id" optionLabel="Definition"
                        :class="{'p-invalid':v$.RoleId.$invalid && submitted}"/>
              <small class="p-error" v-if="(v$.RoleId.$invalid && submitted)">Rol Boş Bırakılamaz.</small>
          </div>



         <div class="field">
            <label for="Password">Şifre*</label>
            <Password id="password" v-model="v$.Password.$model" toggleMask :class="{'p-invalid':v$.RoleId.$invalid && submitted}">
              <template #footer>

                <ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
                  <li>En az bir küçük harf</li>
                  <li>En az bir büyük harf</li>
                  <li>En az bir  rakam</li>
                  <li>Minimum 8 karakter</li>
                </ul>
              </template>
            </Password>
           <small class="p-error" v-if="(v$.Password.$invalid&&submitted)">Parola Boş Bırakılamaz.</small>
          </div>
          <Button label="Kaydet" icon="pi pi-check" class="p-button-success p-button-outlined mb-2"  type="Submit"/>
            <Button label="İptal" icon="pi pi-times" class="p-button-danger p-button-outlined" @click="closeDialog"/>



          </form>





    </Dialog>

</template>

<script>
import {ref, onMounted} from "vue";
import {email,required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import UsersService from "../../service/users.service";
import {useToast} from "primevue/usetoast";


export default {
  props:{
    closeDialog:{
      type:Function,
      required:true
    },
    operation:{
      type:Number,
      required:true
    },
    userId:{
      type:Number,
      required:true
    },
  },

  setup(props){
    onMounted(  async ()=>{
      await UsersService.getRole().then(response =>{
       resultRole.value= response.Payload
        console.log("rol tablosu",response)
    })
     await UsersService.getDepartment().then(response =>{
       resultDepartment.value= response.Payload
        console.log("departman tablosu",response)
    })
      if(props.operation === 1)
        return;

      if(!props.userId)
        return;
      console.log("userId",props.userId)
      await UsersService.getUser(props.userId).then(response=>{

        state.value=response.data.Payload;
        console.log("Güncellemeye gelen state",state.value)
      })


    });


    const submitted=ref(false)
    const manager=ref()
    const toast=useToast()

    const state = ref({
        Id:null,
        FullName:'',
        EmailAddress:'',
        DepartmentId:'',
        RoleId:'',
        Password:'',
      IsManager:'',
      IsKeyUser:''
    })


    const resultRole=ref([

    ])

    const resultDepartment=ref([

    ])

    const rules= {
      Id:{required},
      FullName: {required},
      EmailAddress:{required,email},
      DepartmentId:{required},
      RoleId:{required},
      Password:{required},
      IsManager:{required},
      IsKeyUser:{required}
    }
    const v$ = useVuelidate(rules,state)



    const saveUser= (isFormValid)=>{
      submitted.value = true;
      console.log("stateee",state)
      if (!isFormValid){
        return
      }

      if (props.operation===1){
        state.value.Id=parseInt(state.value.Id)
        UsersService.addUser(state.value).then(response => {

          if (response.data.Success)
            console.log("stateee",state)
            props.closeDialog(true)
        })
      }else{
            UsersService.updateUser(state.value).then(response =>{
              if (response.data.Success){
                props.closeDialog(true)
                console.log("asdasd")

                toast.add({severity: 'success', summary: 'Kullanıcı Güncellendi', detail:'Başarılı' ,life:3000});
              }
            })
          }
      }



    // onMounted(() => {
    //   if (props.operation===1)
    //     return;
    //     if (!props.userId)
    //
    //       return;
    //
    //     UsersService.getUserList(props.userId).then((response =>{
    //       if (response.data.Success){
    //         state.value=response.data.Payload;
    //       }
    //     }))
    // })

    return{
      state,saveUser,v$,resultDepartment,resultRole,manager,submitted
    }
  }


}
</script>

<style scoped>

</style>