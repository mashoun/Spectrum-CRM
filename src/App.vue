<template>
  <section v-if="!isLogedIn" class="w-100 h-100 bg-light z-1 position-fixed top-0 start-0 d-flex justify-content-center align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-5">
          <section class="d-flex flex-column gap-2 shadow rounded px-4 py-4 align-items-center">
            <img src="./assets/logo.svg" alt="logo" class="img-fluid rounded" width="50">
            <h5 class="text-center pop fs-5 text-primary">Spectrum CRM</h5>
            <div class="w-100 my-3 d-flex flex-column gap-2">
              <input type="text" @keyup.enter="utilities.focus('password')" id="username" placeholder="Username" class="form-control loginInput" v-model="username">
              <input type="password" @keyup.enter="Login" placeholder="Password" id="password" class="form-control loginInput" v-model="password">
              <button :disabled="spinner" @click="Login" class="w-100 btn btn-primary">
                <span v-if="spinner" class="spinner-grow spinner-grow-sm"></span>
                <span v-else>Login</span>
              </button>
            </div>
            <small class="fs-xsmall pop text-secondary text-center">Developed by 
              <a href="https://libancode.com">Libancode</a> - version 1.1.3
            </small>
          </section>
        </div>
      </div>
    </div>
  </section>
  <header v-if="isLogedIn" class="pop w-100 p-3 position-fixed top-0 start-0 z-2 bg-light shadow d-flex align-items-center justify-content-between">
    <section>
      <h5 class="m-0">Spectrum Dashboard</h5>
    </section>
    <nav class="d-none d-lg-flex gap-3 align-items-center">
      <router-link to="/">+Profile</router-link>
      <router-link to="/Agents">+Agents</router-link>
      <router-link to="/Properties">+Properties</router-link>
      <router-link to="/Feedbacks">+Testimonials</router-link>
    </nav>
    <i class="d-block d-lg-none bi bi-three-dots-vertical fs-3 text-secondary" data-bs-toggle="dropdown" ></i>
    <ul class="dropdown-menu">
      <li><router-link to="/" class="dropdown-item">+Profile</router-link></li>
      <li><router-link to="/Agents" class="dropdown-item">+Agents</router-link></li>
      <li><router-link to="/Properties" class="dropdown-item">+Properties</router-link></li>
      <li><router-link to="/Feedbacks" class="dropdown-item">+Testimonials</router-link></li>
    </ul>
  </header>
  <main v-if="isLogedIn" style="margin-top:100px;" class="pb-5">
    <router-view></router-view>
  </main>
</template>
<script>
import {useProfile} from './stores/profile'
import utilities from './utilities.js'
export default {
  setup(){
    const store = useProfile()
    return {store}
  },
  data(){
    return{
      isLogedIn:false,
      devi:false,
      username:'',
      password:'',
      utilities,
      spinner:false
    }
  },
  methods:{

    async Login(){  
      try{
        this.spinner = true
        var api = this.store.getApi()
        api += `?username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`
        // console.log(api);
        var res = await fetch(api)
        res = await res.json()
        console.log(res)
        this.store.username = this.username
        this.store.password = this.password
        this.isLogedIn = true
        this.spinner = false

      }catch(err){
        console.log(err);
        
        document.querySelectorAll('.loginInput').forEach(e=>{
          // console.log(e);
          e.classList.add('is-invalid')
        })
        this.spinner = false
      }
    }
  },
  async mounted(){
    this.store.getProfile()
    // console.log(await this.store.getProfile()); 
  }
}
</script>

