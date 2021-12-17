
<template>
  <base-card>

    </base-card>
</template>
<script>

import ApiService from "../service/apiService";
import BaseCard from "../components/UI/BaseCard";

export default {
  components: {BaseCard},
  data() {
		return {

		}
	},
methods:{
    gittim(){
      ApiService.get('Demo')
           .then(({data}) => {
             console.log("response yeri",data)
           })
           .catch(({response}) => {
               return response;
           });
      console.log(ApiService.get('Demo'))
    }
}

}

</script>