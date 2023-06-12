<template>
  <section class="container">
    <div class="row g-3 justify-content-center">
      <div class="col-12">
        <h4>Edit your profile info</h4>
      </div>

      <div class="col-12">
            <img v-if="store.contact.logo" :src="store.contact.logo" alt="logo" class="img-fluid my-2 shadow-sm" width="80">
            <label v-else class="px-1 my-2 text-secondary">Change logo</label>
            <input type="file" @change="uploadLogo" class="form-control">
      </div>
      <div class="col-12">
          <div class="form-floating">
              <input type="text" v-model="store.contact.heading" class="form-control" id="floatingInput1" placeholder="name@example.com">
              <label for="floatingInput1">Heading</label>
          </div>
      </div>
      <div class="col-12">
          <div class="form-floating">
              <input type="text" v-model="store.contact.bio"  class="form-control" id="floatingInput2" placeholder="name@example.com">
              <label for="floatingInput2">BIO</label>
          </div>
      </div>
      <div class="col-12">
          <div class="form-floating">
              <input type="text" v-model="store.contact.email"  class="form-control" id="floatingInput3" placeholder="name@example.com">
              <label for="floatingInput3">Email address</label>
          </div>
      </div>
      <div class="col-12">
          <div class="form-floating">
              <input type="number" v-model="store.contact.number"  class="form-control" id="floatingInput4" placeholder="name@example.com">
              <label for="floatingInput4">Phone number</label>
          </div>
      </div>
      <div class="col-12">
          <div class="form-floating">
              <input type="text" v-model="store.contact.address"  class="form-control" id="floatingInput5" placeholder="name@example.com">
              <label for="floatingInput5">Address</label>
          </div>
      </div>
      <div class="col-12">
          <div class="form-floating">
              <input type="text" v-model="store.contact.whatsapp"  class="form-control" id="floatingInput6" placeholder="name@example.com">
              <label for="floatingInput6">Whatsapp NB</label>
          </div>
      </div>
      <div class="col-12">
          <div class="form-floating">
              <input type="text" v-model="store.contact.facebook"  class="form-control" id="floatingInput7" placeholder="name@example.com">
              <label for="floatingInput7">Facebook URL</label>
          </div>
      </div>
      <div class="col-12">
          <div class="form-floating">
              <input type="text" v-model="store.contact.instagram"  class="form-control" id="floatingInput8" placeholder="name@example.com">
              <label for="floatingInput8">Instagram URL</label>
          </div>
      </div>
      <div class="col-12 col-md-6 col-lg-2">
        <button class="w-100 btn btn-primary btn-sm" :disabled="spinner" @click="saveProfile"> <span v-if="spinner" class="spinner-grow spinner-grow-sm"></span> <span v-else>Save changes</span></button>
      </div>
    </div>
  </section>
</template>

<script>

import {useProfile} from '../stores/profile'
import utilities from '../utilities.js'
export default {

  setup(){
    const store = useProfile()
    return {store}
  },
  data(){
    return{
        spinner:false,
        utilities
    }
  },
  methods:{
    isRequired(name){
        return this.store.isRequired(this.store.contact,name)

    },
    saveProfile(){
        if(confirm('Are you sure?') === true){
            this.spinner = true
            fetch(`${this.store.getApi()}${this.store.login()}&setContact=1`,{
                method:'POST',
                headers:{
                    'Content-Type':'text/plain'
                },
                body:JSON.stringify(this.store.contact)
            }).then(res => res.json()).then(res => {
                console.log(res);
                this.spinner = false
                if(res == '201') alert('Meshe l7al')
            }).catch(err => {
                console.log(err);
                this.spinner = false
                if(res == '201') alert('Ma Meshe l7al')
            })
        }else{
            console.log('not saved');
        }
    },
    async uploadLogo(e){
        this.spinner = true
        var src64 = await utilities.file64(e.target.files[0])
        console.log(src64);
        // var res = await utilities.hostImages(`${this.store.getApi()}${this.store.login()}&hostImages=1&folderId=1kKgPpa5ywLhRhLXTxYV1jXOGPO1fKOxU`,{
        //     alt:`LOGO-${utilities.getCurrentDate}`,
        //     src64:src64
        // })

        // res = await res.json()
        fetch(`${this.store.getApi()}${this.store.login()}&hostImages=1&folderId=1kKgPpa5ywLhRhLXTxYV1jXOGPO1fKOxU`,{
            method:"POST",
            headers:{
                'Content-Type':'text/plain'
            },
            body:JSON.stringify([{
                "alt":`LOGO-${utilities.getCurrentDate()}`,
                "src64":src64
            }])
        }).then(res => res.json()).then(res => {
            console.log(res);
            this.store.contact.logo = res[0].src
            this.spinner = false
        }).catch(err => {
            console.log(err);
            this.spinner = false
        })

    }
  }
}
</script>