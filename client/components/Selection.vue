<template>
<div>
    <div class="card info-card">
        <assembly
            v-for="a in assemblies"
            :assembly="a"
            :binSets="binSets"
            :selected="a === assembly"
            :style="{ cursor: a === assembly ? 'initial' : 'cursor' }"
            @click.native="selectAssembly(a)">
        </assembly>
        <div class="card-footer text-muted" style="padding: 0">
            <assembly-upload></assembly-upload>
        </div>
    </div>
    
    <div class="float-xs-right">
        <small><router-link to="/help">Stuck or need more info?</router-link></small> <br>
        <small class="text-muted">Made by Mohammed Charrout</small> <br>
        <small class="text-muted">Supervised by Lex Overmars</small>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import AssemblyUpload from '../components/AssemblyUpload'
import Assembly from '../components/Assembly'

export default {
    components: {
        AssemblyUpload,
        Assembly
    },

    methods: {
        selectAssembly(assembly) {
            this.$store.dispatch('SELECT_ASSEMBLY', assembly).then(() => {
            })
        }
    },
    
    computed: {
        ...mapState([
            'assemblies',
            'assembly',
            'binSets',
            'binSet'
        ])
    },
    
    beforeMount() {
        // Fetch data from server
        this.$store.dispatch('GET_ASSEMBLIES').then(() => {
            this.loading = false
            if (!this.assembly) 
                this.$nextTick(() => $('[data-toggle="tooltip"]').tooltip('show'))
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

#add-btn {
    border: 0;
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
</style>

<style scoped>
.info-card {
    border-left-width: 1px;
}

.list-group-item {
    padding: 0;
}
</style>