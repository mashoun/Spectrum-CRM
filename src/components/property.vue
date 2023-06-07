<template>

    <section class="position-relative shadow bg-image" :id="data.id">
        <!--  -->
        <div class="w-100 ratio ratio-3x4 overflow-hidden rounded">
            <img :id="`image-${data.index}`" :src="data.thumbnail" :alt="data.location" class="skeleton img-zoom img-brightness rounded img-fluid object-fit-cover">
        </div>
        <div class="w-100 position-absolute bottom-0 p-3 d-flex flex-column gap-2">
            <small class="fs-smaller text-light text-uppercase">spectrum real estate<i class="bi bi-dot"></i><span class="badge text-bg-warning">{{data.type}}</span></small>
            <h4 class="fs-4 text-light pop text-fade d-flex align-items-center gap-2">
                <span class="material-symbols-outlined">location_on</span>
                <span class="m-0 text-fade text-underline">{{data.location}}</span>
            </h4>
            <div class="container">
                <div class="row bg-glass rounded text-light py-2">
                    <div class="col-3">
                        <div class="d-flex flex-column gap-1">
                            <span class="fs-xsmall">AREA</span>
                            <span class="text-warning fs-small">{{data.area}} m2</span>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="d-flex flex-column gap-1">
                            <span class="fs-xsmall">BATHROOM</span>
                            <span class="text-warning fs-small">{{data.bathrooms}}</span>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="d-flex flex-column gap-1">
                            <span class="fs-xsmall">BEDS</span>
                            <span class="text-warning fs-small">{{data.bedrooms}}</span>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="d-flex flex-column gap-1">
                            <span class="fs-xsmall">PARKING</span>
                            <span class="text-warning fs-small">{{data.parking}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <button title="Download as image" @click="downloadAsImage(data.id,`${data.location}-${data.area}-${data.price}`)" class="btn btn-sm btn-light fw-bold ls-2 text-uppercase">
                <span v-if="spinner" class="spinner-grow spinner-grow-sm"></span>
                <span v-else class="pop">For {{data.status}} - {{data.price}} $</span>
            </button>
            <!-- <button class="btn btn-sm btn-outline-light" @click="downloadAsImage(data.id,`${data.location}-${data.area}-${data.price}`)">Download Poster</button> -->
        </div>
    
    </section>

</template>
<script>
import utilities from '../utilities.js'
import {useProfile} from '../stores/profile'
export default {
    setup(){
        const store = useProfile()
        return {store}
    },
    data(){
        return{
            utilities,
            spinner:false
        }
    },
    props:['data'],
    methods:{
        async downloadAsImage(elementId,filename){
            this.spinner = true
            var canvas = await html2canvas(document.getElementById(elementId),{
                backgroundColor: null
            })
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.download = filename;
            link.href = canvas.toDataURL("image/png");
            link.click();
            document.body.removeChild(link);
            this.spinner = false
        },
        url64(id){
            return new Promise((resolve,reject) => {
                console.log(`${this.store.getApi()}?image64=1&fileId=${id}`);
                fetch(`${this.store.getApi()}?image64=1&fileId=${id}`)
                .then(response => response.json())
                .then(res => {
                    console.log(res);
                    resolve(res.src)
                })
                .catch(error => {
                    console.error('Error:', error);
                    reject(error)
                });

            })

        }
    },
    async mounted(){
        // console.log(await this.url64(this.data.thumbnail));
    }
}
</script>