import { defineStore } from "pinia";

export const useProfile = defineStore('profile',{
    state:() => ({
        contact:{
            logo:'',
            heading:'',
            bio:'',
            address:'',
            email:'',
            number:'',
            whatsapp:'',
            facebook:'',
            instagram:''
        },
        agent: {
            name:'',
            bio:'',
            thumbnail:''
        },
        feedback:{
            "index": "",
            "date": "",
            "id": "",
            "name": "",
            "thumbnail": "",
            "job": "",
            "feedback": ""
        },
        story:
        {
            "date": "",
            "thumbnail": ""
        },
        property:
        {
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
        },
        profile:{
            "contact": {
                "logo": "",
                "heading": "",
                "bio": "",
                "address": "",
                "email": "",
                "number": "",
                "whatsapp": "",
                "facebook": "",
                "instagram": ""
            },
            "agents": [
                {
                    "index": "",
                    "name": "",
                    "id": "",
                    "bio": "",
                    "thumbnail": ""
                }
            ],
            "properties": [
                {
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
            ],
            "feedbacks": [
                {
                    "index": "",
                    "date": "",
                    "id": "",
                    "name": "",
                    "thumbnail": "",
                    "job": "",
                    "feedback": ""
                }
            ],
            "stories":[
                {
                    "index": "",
                    "date": "",
                    "id": "",
                    "thumbnail": ""
                },
            ]
        },
        username:'',
        password:''
        

    }),
    actions:{

        getApi(){
            return 'https://script.google.com/macros/s/AKfycbwPyfOfFtqevq2h28lldDv4_114NO9FGpPu1TOLTq43R5hJp5KvBS6STC3tQbaVnaF8LQ/exec'
        },
        login(){
            return `?username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`
        },
        getProfile(){
            fetch(`${this.getApi()}?getContact=1`).then(res => res.json()).then(res => {
                this.profile = res
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        
        isRequired(obj,name){
            if(obj[name] != '') return true
            return false
        },

    }
})