<template>
    <section class="container">
        <div class="row">
            <div class="col-12 d-flex justify-content-between align-items-center pop px-3">
                <h4 class="fs-4">Manage your properties</h4>
                <button data-bs-toggle="modal" data-bs-target="#exampleModal" :disabled="spinner" class="d-block d-lg-none btn btn-sm btn-primary"><span class="material-symbols-outlined">real_estate_agent</span></button>
                
                <button data-bs-toggle="modal" data-bs-target="#exampleModal" :disabled="spinner" class="d-none d-lg-block btn btn-sm btn-primary">
                    <span v-if="spinner" class="spinner-grow spinner-grow-sm"></span>
                    <span v-else >New property</span>
                </button>
            </div>
        </div>
        <div class="row g-3 my-5">
            <div class="col-12 col-md-6 col-lg-4" v-for="p in store.profile.properties" :key="p">
                <property :data="p" @dblclick="removeProperty(p)"></property>
            </div>
        </div>
    </section>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title pop fs-5" id="exampleModalLabel">Add new property</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body d-flex flex-column gap-3">
                <div class="">
                    <img v-if="store.property.thumbnail" :src="store.property.thumbnail" alt="logo" class="img-fluid my-2 shadow-sm" width="80">
                    <label v-else class="px-1 my-2 text-secondary">Property images</label>
                    <input type="file" @change="uploadLogo" multiple accept="image/png,image/jpg,image/jpeg" class="form-control">
                </div>
                <div class="">
                    <select v-model="store.property.type" class="form-control">
                        <option value="">Property Type</option>
                        <option value="Apartments">Apartments</option>
                        <option value="Lands">Lands</option>
                        <option value="Villas">Villas</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Offices">Offices</option>
                    </select>
                </div>
                <div class="">
                    <select v-model="store.property.status" class="form-control">
                        <option value="">Property Status</option>
                        <option value="Rent">Rent</option>
                        <option value="Sale">Sale</option>
                    </select>
                </div>
                <div class="form-floating">
                    <input type="text" v-model="store.property.location" class="form-control" placeholder="name@example.com">
                    <label for="floatingInput2">Location</label>
                </div>
                <div class="form-floating">
                    <input type="number" v-model="store.property.price" class="form-control" placeholder="name@example.com">
                    <label for="floatingInput2">Price $</label>
                </div>
                <div class="form-floating">
                    <input type="text" v-model="store.property.amenities" class="form-control" placeholder="name@example.com">
                    <label for="floatingInput2">Amenities ( comma between )</label>
                </div>
                <div class="px-2">
                    <label for="customRange1" class="form-label">Area {{store.property.area}} m2</label>
                    <input type="range" v-model="store.property.area" class="form-range" step="5" min="10" max="1000">
                </div>
                <div class="px-2">
                    <label for="customRange1" class="form-label">Bedrooms {{store.property.bedrooms}}</label>
                    <input type="range" v-model="store.property.bedrooms" class="form-range" min="1" max="20">
                </div>
                <div class="px-2">
                    <label for="customRange1" class="form-label">Bathrooms {{store.property.bathrooms}}</label>
                    <input type="range" v-model="store.property.bathrooms" class="form-range" min="1" max="10">
                </div>
                <div class="px-2">
                    <label for="customRange1" class="form-label">Parking {{store.property.parking}}</label>
                    <input type="range" v-model="store.property.parking" class="form-range" min="0" max="10">
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" @click="saveChanges" :disabled="spinner" class="btn btn-primary">
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
import property from '../components/property.vue'
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
    components:{property},
    methods:{
        
    async uploadLogo(e){
        this.spinner = true
        var images = e.target.files
        // console.log(images);
        var images64 = []
        for(let i = 0 ; i < images.length ; i++){
            // console.log(images[i]);
            images64.push({
                alt: `PROPERTIES-${utilities.getCurrentDate()}`,
                src64: await utilities.optimizeImageQuality(await utilities.file64(images[i]),0.7)
            })
        }
        fetch(`${this.store.getApi()}${this.store.login()}&hostImages=1&folderId=1ZgrKx62YNUAnmohYmmhFp4PUBO75R-aY`,{
            method:"POST",
            headers:{
                'Content-Type':'text/plain'
            },
            body:JSON.stringify(images64)
        }).then(res => res.json()).then(res => {
            console.log(res);
            var imagesURLS = (res) => {
                var urls = []
                
                for(let i = 0 ; i < res.length ; i++){
                    urls.push(res[i].src)
                }
                return urls.toString()
            }
            this.store.property.images = imagesURLS(res)
            this.store.property.thumbnail = res[0].src
            this.spinner = false
        }).catch(err => {
            console.log(err);
            this.spinner = false
        })

    },
    
    saveChanges(){
        if(confirm('Are you sure?') === true){
            this.spinner = true
            this.store.property.date = new Date()
            fetch(`${this.store.getApi()}${this.store.login()}&addItem=1`,{
                method:'POST',
                headers:{
                    'Content-Type':'text/plain'
                },
                body:JSON.stringify({
                    sheetName:"Properties",
                    keys:['date','thumbnail','images','type','location','status','price','area','amenities','bedrooms','bathrooms','parking'],
                    data:this.store.property
                })
            }).then(res => res.json()).then(res => {
                console.log(res);
                this.spinner = false
                if(res == '201') alert('Meshe l7al')
                this.store.profile.properties.push(this.store.property)
            }).catch(err => {
                console.log(err);
                this.spinner = false
                if(res == '201') alert('Ma Meshe l7al')
            })
        }else{
            console.log('not saved');
        }
    },
    removeProperty(item){
        if(confirm(`Remove ${item.location} ?`) === true){
        this.spinner = true
        fetch(`${this.store.getApi()}${this.store.login()}&removeItem=1`,{
            method:'POST',
            headers:{
                'Content-Type':'text/plain'
            },
            body:JSON.stringify({
                sheetName:"Properties",
                col:'A',
                index:item.date
            })
        }).then(res => res.json()).then(res => {
            console.log(res);
            this.spinner = false
            this.store.profile.properties = this.store.profile.properties.filter(a => {
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
    }
    }
}
</script>