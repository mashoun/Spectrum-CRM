<template>
  <section class="container">
    <div class="row g-3">
      <div class="col-12 d-flex justify-content-between align-items-center pop px-3">
        <h4 class="fs-4">Agents Database</h4>
        <button data-bs-toggle="modal" data-bs-target="#exampleModal" :disabled="spinner" class="d-block d-lg-none btn btn-sm btn-primary"><span class="material-symbols-outlined">person_add</span></button>
        
        <button data-bs-toggle="modal" data-bs-target="#exampleModal" :disabled="spinner" class="d-none d-lg-block btn btn-sm btn-primary">
            <span v-if="spinner" class="spinner-grow spinner-grow-sm"></span>
            <span v-else >Add new agent</span>
        </button>
      </div>
      <div class="col-12">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Delete</th>
                <th scope="col">Thumbnail</th>
                <th scope="col">Name</th>
                <th scope="col">Bio</th>
              </tr>
            </thead>
            <tbody v-if="store.profile.agents.length > 0" >
              <tr v-for="a in store.profile.agents" :key="a">
                <th scope="row"><span @click="removeAgent(a.name)" class="material-symbols-outlined text-danger point" :title="`Delete ${a.name}`">delete</span></th>
                <td><div class="ratio ratio-1x1" style="width:100px;"><img :src="a.thumbnail" :alt="a.name" class="img-fluid object-fit-cover rounded"></div></td>
                <td>{{a.name}}</td>
                <td>{{a.bio}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title pop fs-5" id="exampleModalLabel">Add new agent</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body d-flex flex-column gap-3">
                <div class="">
                    <img v-if="store.agent.thumbnail" :src="store.agent.thumbnail" alt="logo" class="img-fluid my-2 shadow-sm" width="80">
                    <label v-else class="px-1 my-2 text-secondary">Agen's image</label>
                    <input type="file" @change="uploadLogo" class="form-control">
                </div>
                <div class="form-floating">
                    <input type="text" v-model="store.agent.name" class="form-control" id="floatingInput1" placeholder="name@example.com">
                    <label for="floatingInput1">Agent's name</label>
                </div>
                <div class="form-floating">
                    <input type="text" v-model="store.agent.bio" class="form-control" id="floatingInput2" placeholder="name@example.com">
                    <label for="floatingInput2">Agent's bio</label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" @click="saveChanges" :disabled="spinner || !isRequired('thumbnail')  || !isRequired('name')  || !isRequired('bio') " class="btn btn-primary">
                    <span v-if="spinner" class="spinner-grow spinner-grow-sm"></span>
                    <span v-else >Save changes</span>
                </button>
            </div>
            </div>
        </div>
    </div>
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
        utilities,
    }
  },
  methods:{
    isRequired(name){
        return this.store.isRequired(this.store.agent,name)
    },
    saveChanges(){
        if(confirm('Are you sure?') === true){
            this.spinner = true
            fetch(`${this.store.getApi()}${this.store.login()}&addItem=1`,{
                method:'POST',
                headers:{
                    'Content-Type':'text/plain'
                },
                body:JSON.stringify({
                    sheetName:"Agents",
                    keys:['name','bio','thumbnail'],
                    data:this.store.agent
                })
            }).then(res => res.json()).then(res => {
                console.log(res);
                this.spinner = false
                if(res == '201') alert('Meshe l7al')
                this.store.profile.agents.push(this.store.agent)
                this.store.agent = {
                    "index": "",
                    "name": "",
                    "id": "",
                    "bio": "",
                    "thumbnail": ""
                }
            }).catch(err => {
                console.log(err);
                this.spinner = false
                if(res == '201') alert('Ma Meshe l7al')
            })
        }else{
            console.log('not saved');
        }
    },
    removeAgent(name){
        if(confirm(`Remove ${name} ?`) === true){
            this.spinner = true
            fetch(`${this.store.getApi()}${this.store.login()}&removeItem=1`,{
                method:'POST',
                headers:{
                    'Content-Type':'text/plain'
                },
                body:JSON.stringify({
                    sheetName:"Agents",
                    col:'A',
                    index:name
                })
            }).then(res => res.json()).then(res => {
                console.log(res);
                this.spinner = false
                this.store.profile.agents = this.store.profile.agents.filter(a => {
                    return a.name != name
                })
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
        
        fetch(`${this.store.getApi()}${this.store.login()}&hostImages=1&folderId=1DJVdq2N0Om-v8Qr_EeSb-5z1AGX4DlDD`,{
            method:"POST",
            headers:{
                'Content-Type':'text/plain'
            },
            body:JSON.stringify([{
                "alt":`AGENT-${utilities.getCurrentDate()}`,
                "src64":src64
            }])
        }).then(res => res.json()).then(res => {
            console.log(res);
            this.store.agent.thumbnail = res[0].src
            this.spinner = false
        }).catch(err => {
            console.log(err);
            this.spinner = false
        })

    }
  }
}
</script>