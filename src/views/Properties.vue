<template>
    <section class="container">
        <div class="row">
            <div class="col-12 col-lg-4 mb-3">
                <div class="input-group">
                    <input type="text" v-model="refID" placeholder="Reference ID" class="form-control">
                    <!-- <div class="input-group-text bg-warning"><i class="bi bi-search"></i></div> -->
                </div>
            </div>
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
            <div class="col-12 col-md-6 col-lg-4" v-for="p in filteredProperties" :key="p">
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
                <div class="form-check form-switch">
                    <input class="form-check-input" v-model="store.property.isHotDeal" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                    <label class="form-check-label" for="flexSwitchCheckDefault"><b>Hot deal</b></label>
                </div>
                <div class="">
                    <h6>Property Type</h6>
                    <select v-model="store.property.type" class="form-control">
                        <!-- <option value="">Property Type</option> -->
                        <option value="Apartments">Apartments</option>
                        <option value="Lands">Lands</option>
                        <option value="Villas">Villas</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Offices">Offices</option>
                        <option value="Chalet">Chalet</option>
                        <option value="Buildings">Buildings</option>
                    </select>
                </div>
                <div class="d-flex gap-3 flex-column" v-if="isLands">
                    <h6>Lands type</h6>
                    <select v-model="store.property.landType" class="form-control">
                        <!-- <option value="">Land type</option> -->
                        <option value="Residential">Residential</option>
                        <option value="Agricultural">Agricultural</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Others">Others</option>
                    </select>
                    
                    <div class="form-floating">
                        <input type="text" v-model="store.property.landZone" class="form-control" placeholder="name@example.com">
                        <label for="floatingInput2">Land zone</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" v-model="store.property.landSlope" class="form-control" placeholder="name@example.com">
                        <label for="floatingInput2">Land slope</label>
                    </div>
                </div>
                <div class="d-flex gap-3 flex-column" v-if="isWarehouse">
                    <h6>Warehouse type</h6>
                    <select v-model="store.property.warehouseType" class="form-control">
                        <!-- <option value="">Warehouse type</option> -->
                        <option value="Distribution">Distribution</option>
                        <option value="Consolidated">Consolidated</option>
                        <option value="Private">Private</option>
                        <option value="Others">Others</option>
                    </select>
                    
                    <div class="form-floating">
                        <input type="number" v-model="store.property.warehouseHeight" class="form-control" placeholder="name@example.com">
                        <label for="floatingInput2">Warehouse height</label>
                    </div>
                </div>
                <div class="">
                    <h6>Property status</h6>
                    <select v-model="store.property.status" class="form-control">
                        <!-- <option value="">Property Status</option> -->
                        <option value="Rent">Rent</option>
                        <option value="Sale">Sale</option>
                    </select>
                </div>
                <div class="form-floating">
                    <input type="text" v-model="store.property.location" class="form-control" placeholder="name@example.com">
                    <label for="floatingInput2">Location</label>
                </div>
                <!-- <div class="form-floating"> -->
                    <textarea rows="4" type="text" v-model="store.property.description" class="form-control" placeholder="Description"></textarea>
                    <!-- <label for="floatingInput2">Description</label> -->
                <!-- </div> -->
                <!-- <div class="form-floating"> -->
                    <h6 class="ps-2">Price : {{byComma}} $</h6>
                    <input type="number" v-model="store.property.price" class="form-control ls-2" placeholder="Enter Price">
                    <!-- <label for="floatingInput2">Price {{byComma}}$</label> -->
                <!-- </div> -->
                <div class="form-floating">
                    <input type="text" v-model="store.property.amenities" class="form-control" placeholder="name@example.com">
                    <label for="floatingInput2">Amenities ( comma between )</label>
                </div>
                <div class="form-floating">
                    <input type="number" v-model="store.property.area" class="form-control ls-2 font-monospace" placeholder="name@example.com">
                    <label for="floatingInput2">Area m2</label>
                </div>
                <div class="" v-if="!(isLands || isWarehouse)">
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


            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" @click="saveChanges" :disabled="spinner || !isRequired('thumbnail') || !isRequired('type') || !isRequired('status') || !isRequired('location') || !isRequired('description') || !isRequired('price') || !isRequired('amenities') || !isRequired('area')" class="btn btn-primary">
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
            utilities,
            refID:""
        }
    },
    computed:{
        byComma(){
            return this.store.property.price.toLocaleString()
        },
        isLands(){
            if(this.store.property.type == 'Lands'){
                return true
            }
            return false
        },
        isWarehouse(){
            if(this.store.property.type == 'Warehouse'){
                return true
            }
            return false
        },
        filteredProperties(){
            if(this.refID){
                return this.store.profile.properties.filter( p => {
                    return this.utilities.dateId(p.date) == this.refID
                })
            }
            return this.store.profile.properties
        }
    },
    components:{property},
    methods:{
        formatNumber(input) {
        // Remove any existing commas and convert the value to a number
        let value = parseFloat(input.value.replace(/,/g, ''));

        // Use toLocaleString() method to format the number with commas
        value = value.toLocaleString();

        // Set the formatted value back to the input
        input.value = value;
        },
    filterById(){
        
    },
    isRequired(name){
        return this.store.isRequired(this.store.property,name)
    },
        
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
                    keys:['date','thumbnail','images','type','location','status','price','area','amenities','bedrooms','bathrooms','parking','isHotDeal','landZone','landType','landSlope','warehouseType','warehouseHeight','description'],
                    data:this.store.property
                })
            }).then(res => res.json()).then(res => {
                console.log(res);
                this.spinner = false
                if(res == '201') alert('Meshe l7al')
                this.store.profile.properties.push(this.store.property)
                this.store.property = {

                    "index": "",
                    "date": "",
                    "id": "",
                    "thumbnail": "",
                    "images": "",
                    "type": "",
                    "location": "",
                    "status": "",
                    "price": "",
                    "area": "",
                    "amenities": "",
                    "bedrooms": "",
                    "bathrooms": "",
                    "parking": "",
                    "landZone":"",
                    "landType":"",
                    "landSlope":"",
                    "warehouseType":"",
                    "warehouseHeight":"",
                    "description":"",
                    "isHotDeal":"false"
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