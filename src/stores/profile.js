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
            "parking": ""
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
                    "parking": ""
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
            ]
        },
        username:'',
        password:''
        

    }),
    actions:{

        getApi(){
            return 'https://script.google.com/macros/s/AKfycbwFPq73v_0AJcClYI1XRcC_zINw3h9OtWAYIW0TWtICd9eueZB-vdTftv2LpctnLxkIFg/exec'
        },
        login(){
            return `?username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`
        },
        getProfile(){
            fetch(`${this.getApi()}?getContact=1`).then(res => res.json()).then(res => {
                this.profile = res
            }).catch(err => {
                console.log(err);
            })
        }

    }
})