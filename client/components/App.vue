<template>
<div class="container" id="app">
    <div class="alert-warning" id="message" v-if="message">
        <strong>
            {{ message }}
            <span class="fa fa-refresh fa-spin fa-lg"></span>
        </strong>
    </div>
        
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</div>
</template>

<script>
import 'bootstrap'
import { mapActions } from 'vuex'

export default {
    methods: {
        ...mapActions({
            checkAssemblyJob: 'CHECK_ASSEMBLY_JOB',
            checkBinSetJobs: 'CHECK_BIN_SET_JOBS'
        })
    },
    
    computed: {
        message() {
            return this.$store.state.message
        },
        assemblyJob() {
            return this.$store.state.assemblyJob
        }
    },

    created() {
        setInterval(() => {
            if (this.assemblyJob) this.checkAssemblyJob()
            this.checkBinSetJobs()
        }, 5000)
    }
}
</script>

<style>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../../node_modules/font-awesome/css/font-awesome.min.css";

body {
    font-size: 14px;
    background-color: #eee;
}

* {
    -webkit-border-radius: 0 !important;
    -moz-border-radius: 0 !important;
    border-radius: 0 !important;
}

input[type="file"] {
    width: 100%;
    padding: .1rem 0;
    font-size: .9em;
}

.form-group > label {
    font-weight: bold;
    margin-bottom: .25rem;
}

.btn-sm {
    padding: .5rem;
}

.btn-xs {
    padding: .3rem .5rem;
}

.rounded {
    border-radius: .25rem !important;
}

.text-primary {
    color: #31708f !important;
}

#app {
    margin-top: .5em;
    padding: 0;
}

#app > ul {
    color: white;
    background-color: #3b668b;
    margin-bottom: .5em;
    border: 1px solid #3b668b;
}

.nav li > a {
  color: white;
}

.nav li a:hover,
.nav li.dropdown a:focus {
  background-color: steelblue;
  color: white;
}

.nav-link.active {
    color: #555 !important;
    font-weight: bold;
    background-color: white !important;
}

.nav li.disabled a,
.nav li.disabled a:hover {
  color:#bac0c3;
}

.nav-item.open .nav-link {
    background-color: steelblue !important;
}

#message {
    position: absolute;
    left: 50%;
    border: 1px solid #8a6d3b;
    font-size: .8rem;
    top: 2em;
    z-index: 999;
    padding: .3rem .5rem;
    -webkit-box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.75);
       -moz-box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.75);
            box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.75);
}

.back a {
    color: #444;
}
</style>
