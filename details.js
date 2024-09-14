const params = new URLSearchParams(window.location.search)
const urlDetails = params.get("urlDetails")
const { createApp } = Vue
const app = createApp({
    data() {
        return {
            character: [],
            isOpen: false            

        }
    },
    created() {
        this.fetchUrl(urlDetails)
        
    },
    methods: {
        fetchUrl(url){
            fetch(url).then(res => res.json()).then(data => {
                this.character = data
                console.log(this.character)
            })
        },
        openModal() {
            this.isOpen = true
          },
          closeModal() {this.isOpen = false
          }
        



    }
}).mount('#appDetails')