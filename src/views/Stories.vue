<template>
  <section class="container">
    <div class="row g-3">
      <div class="col-12 d-flex justify-content-between align-items-center pop px-3">
        <h4 class="fs-4">Website Stories</h4>
        <button data-bs-toggle="modal" data-bs-target="#exampleModal" :disabled="spinner" class="d-block d-lg-none btn btn-sm btn-primary"><span class="material-symbols-outlined">person_add</span></button>
        
        <button data-bs-toggle="modal" data-bs-target="#exampleModal" :disabled="spinner" class="d-none d-lg-block btn btn-sm btn-primary">
            <span v-if="spinner" class="spinner-grow spinner-grow-sm"></span>
            <span v-else >Add new story</span>
        </button>
      </div>
      <div class="col-12">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Delete</th>
                <th scope="col">Story</th>
              </tr>
            </thead>
            <tbody v-if="store.profile.stories.length > 0" >
              <tr v-for="a in store.profile.stories" :key="a">
                <th scope="row"><span @click="removeAgent(a.date)" class="material-symbols-outlined text-danger point" :title="`Delete ${a.id}`">delete</span></th>
                <td><div class="ratio ratio-1x1" style="width:100px;"><img :src="a.thumbnail" :alt="a.id" class="img-fluid object-fit-cover rounded"></div></td>
                
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
                <h1 class="modal-title pop fs-5" id="exampleModalLabel">Add new story</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body d-flex flex-column gap-3">
                <div class="">
                    <img v-if="store.agent.thumbnail" :src="store.agent.thumbnail" alt="logo" class="img-fluid my-2 shadow-sm" width="80">
                    <label v-else class="px-1 my-2 text-secondary">Story's image</label>
                    <input type="file" @change="uploadLogo" class="form-control">
                </div>
                <!-- <div class="form-floating">
                    <input type="text" v-model="store.agent.name" class="form-control" id="floatingInput1" placeholder="name@example.com">
                    <label for="floatingInput1">Agent's name</label>
                </div>
                <div class="form-floating">
                    <input type="text" v-model="store.agent.bio" class="form-control" id="floatingInput2" placeholder="name@example.com">
                    <label for="floatingInput2">Agent's bio</label>
                </div> -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" @click="saveChanges" :disabled="spinner || !isRequired('thumbnail') " class="btn btn-primary">
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
        return this.store.isRequired(this.store.story,name)
    },
    saveChanges(){
        if(confirm('Are you sure?') === true){
            this.spinner = true
            this.store.story.date = new Date()
            fetch(`${this.store.getApi()}${this.store.login()}&addItem=1`,{
                method:'POST',
                headers:{
                    'Content-Type':'text/plain'
                },
                body:JSON.stringify({
                    sheetName:"Stories",
                    keys:['date','thumbnail'],
                    data:this.store.story
                })
            }).then(res => res.json()).then(res => {
                console.log(res);
                this.spinner = false
                if(res == '201') alert('Meshe l7al')
                this.store.profile.stories.push(this.store.story)
                this.store.story = {
                    "date": "",
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
                    sheetName:"Stories",
                    col:'A',
                    index:name
                })
            }).then(res => res.json()).then(res => {
                console.log(res);
                this.spinner = false
                this.store.profile.stories = this.store.profile.stories.filter(a => {
                    return a.date != name
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
        
        fetch(`${this.store.getApi()}${this.store.login()}&hostImages=1&folderId=14ZOlNEk7i0ZDU8gXTcmRYqfIVEwEwfLy`,{
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
            this.store.story.thumbnail = res[0].src
            this.spinner = false
        }).catch(err => {
            console.log(err);
            this.spinner = false
        })

    }
  }
}
</script>