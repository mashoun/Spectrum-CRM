<template>
  <section class="container">
    <div class="row g-3">
      <div class="col-12 d-flex justify-content-between align-items-center pop px-3">
        <h4 class="fs-4">Feedbacks</h4>
        <button data-bs-toggle="modal" data-bs-target="#exampleModal" :disabled="spinner" class="d-block d-lg-none btn btn-sm btn-primary"><span class="material-symbols-outlined">reviews</span></button>
        
        <button data-bs-toggle="modal" data-bs-target="#exampleModal" :disabled="spinner" class="d-none d-lg-block btn btn-sm btn-primary">
            <span v-if="spinner" class="spinner-grow spinner-grow-sm"></span>
            <span v-else >New testimonial</span>
        </button>
      </div>
      <div class="col-12">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Delete</th>
                <th scope="col">Name</th>
                <th scope="col">Thumbnail</th>
                <th scope="col">Job</th>
                <th scope="col">Feedback</th>
              </tr>
            </thead>
            <tbody v-if="store.profile.feedbacks.length > 0" >
              <tr v-for="f in store.profile.feedbacks" :key="f">
                <th scope="row"><span @click="removeFeedback(f)" class="material-symbols-outlined text-danger point" :title="`Delete ${f.name}`">delete</span></th>
                <td><div class="ratio ratio-1x1"><img :src="f.thumbnail" :alt="f.name" class="img-fluid object-fit-cover rounded"></div></td>
                <td>{{f.name}}</td>
                <td>{{f.job}}</td>
                <td class="text-justify">{{f.feedback}}</td>
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
                <h1 class="modal-title pop fs-5" id="exampleModalLabel">Add new feedback</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body d-flex flex-column gap-3">
                <div class="">
                    <img v-if="store.feedback.thumbnail" :src="store.feedback.thumbnail" alt="logo" class="img-fluid my-2 shadow-sm" width="80">
                    <label v-else class="px-1 my-2 text-secondary">User's image</label>
                    <input type="file" @change="uploadLogo" class="form-control">
                </div>
                <div class="form-floating">
                    <input type="text" v-model="store.feedback.name" class="form-control" id="floatingInput1" placeholder="name@example.com">
                    <label for="floatingInput1">Agent's name</label>
                </div>
                <div class="form-floating">
                    <input type="text" v-model="store.feedback.job" class="form-control" id="floatingInput2" placeholder="name@example.com">
                    <label for="floatingInput2">Agent's job</label>
                </div>
                <div class="form-floating">
                    <input type="text" v-model="store.feedback.feedback" class="form-control" id="floatingInput2" placeholder="name@example.com">
                    <label for="floatingInput2">Agent's Feedback</label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" @click="saveChanges" :disabled="spinner || !isRequired('thumbnail') || !isRequired('name') || !isRequired('job') || !isRequired('feedback')" class="btn btn-primary">
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
        return this.store.isRequired(this.store.feedback,name)
    },
    saveChanges(){
        if(confirm('Are you sure?') === true){
            this.spinner = true
            this.store.feedback.date = new Date()
            fetch(`${this.store.getApi()}${this.store.login()}&addItem=1`,{
                method:'POST',
                headers:{
                    'Content-Type':'text/plain'
                },
                body:JSON.stringify({
                    sheetName:"Feedbacks",
                    keys:['date','name','thumbnail','job','feedback'],
                    data:this.store.feedback
                })
            }).then(res => res.json()).then(res => {
                console.log(res);
                this.spinner = false
                if(res == '201') alert('Meshe l7al')
                this.store.profile.feedbacks.push(this.store.feedback)
                this.store.feedback = {
                    "index": "",
                    "date": "",
                    "id": "",
                    "name": "",
                    "thumbnail": "",
                    "job": "",
                    "feedback": ""
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
    removeFeedback(item){
        if(confirm(`Remove ${item.name} ?`) === true){
            this.spinner = true
            fetch(`${this.store.getApi()}${this.store.login()}&removeItem=1`,{
                method:'POST',
                headers:{
                    'Content-Type':'text/plain'
                },
                body:JSON.stringify({
                    sheetName:"Feedbacks",
                    col:'A',
                    index:item.date
                })
            }).then(res => res.json()).then(res => {
                console.log(res);
                this.spinner = false
                this.store.profile.feedbacks = this.store.profile.feedbacks.filter(a => {
                    return a.date != item.date
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
        
        fetch(`${this.store.getApi()}${this.store.login()}&hostImages=1&folderId=1aHutuk3sTyY9VAog1XqHvYYMC5ezX91g`,{
            method:"POST",
            headers:{
                'Content-Type':'text/plain'
            },
            body:JSON.stringify([{
                "alt":`FEEDBACK-${utilities.getCurrentDate()}`,
                "src64":src64
            }])
        }).then(res => res.json()).then(res => {
            console.log(res);
            this.store.feedback.thumbnail = res[0].src
            this.spinner = false
        }).catch(err => {
            console.log(err);
            this.spinner = false
        })

    }
  }
}
</script>