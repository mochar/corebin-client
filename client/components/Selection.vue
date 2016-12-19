<template>
<div>
    <div v-if="showForm" key="form">
        <assembly-upload @done="showForm = false"></assembly-upload>

        <a href="#" style="text-align: center; display: block" v-show="assemblies.length === 0">
            Try CoReBIN with demo data
        </a>
    </div>

    <div v-else key="assemblies">
        <assembly
            v-for="a in assemblies"
            :assembly="a"
            :binSets="binSets"
            :selected="a === assembly"
            :style="{ cursor: a === assembly ? 'initial' : 'cursor' }">
        </assembly>

        <div class="card-footer text-muted" style="padding: 0">
            <button 
                @click="showForm = true"
                :disabled="assemblyJob"
                class="btn btn-outline-secondary btn-block" 
                style="color: #666; border: 0">
                <span class="fa fa-plus"></span> Assembly
            </button>
        </div>
    </div>
    
    <div class="float-xs-right" id="madeby">
        <div>
            <small><router-link to="/home"><span class="fa fa-home"></span> Home</router-link></small> |
            <small><router-link to="/help">Stuck or need more info?</router-link></small> <br>
        </div>
        <small class="text-muted">Made by Mohammed Charrout</small> <br>
        <small class="text-muted">Supervised by Lex Overmars</small>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AssemblyUpload from '../components/AssemblyUpload'
import Assembly from '../components/Assembly'

export default {
    data() {
        return {
            cancelling: false,
            showForm: false
        }
    },

    components: {
        AssemblyUpload,
        Assembly
    },

    methods: {
        ...mapActions({
            cancelAssemblyJob: 'CANCEL_ASSEMBLY_JOB'
        }),
        selectAssembly(assembly) {
            this.$store.dispatch('SELECT_ASSEMBLY', assembly).then(() => {
            })
        },
        cancelJob() {
            this.cancelling = true
            this.cancelAssemblyJob().done(() => this.cancelling = false)
        }
    },
    
    computed: {
        ...mapState([
            'assemblies',
            'assembly',
            'binSets',
            'binSet',
            'assemblyJob'
        ])
    },
    
    beforeMount() {
        // Fetch data from server
        this.$store.dispatch('GET_ASSEMBLIES').then(() => {
            this.loading = false 
            this.showForm = this.assemblyJob ? false : true
            this.showForm = this.assemblies.length ? false : true
        })
    }
}
</script>

<style>
.assembly-name::before {
    content: "Assembly ";
}

.bin-set-list {
    padding-left: 1rem;
    border-left: 1px solid #ccc;
}

.list-item {
    margin: .5rem 0; 
}

#add-bs-btn {
    margin-top: 1rem;
}

.unselected {
    opacity: .3;
}

.unselected span {
    font-size: large;
}

.unselected:hover {
    opacity: .9;
    transition: opacity .15s ease-in-out;
    cursor: pointer;
}

.assembly-button {
    border: 0;
    padding: .5rem;
}

.btn-sm {
    padding: .25rem .5rem; 
}

#madeby {
    position: fixed;
    bottom: 1rem;
    padding: 1rem;
}
</style>

<style scoped>
.info-card {
    border-left-width: 1px;
}

.list-group-item {
    padding: 0;
}
</style>