<template>
<div class="container" id="app">
    <div class="alert-warning" id="message" v-if="message">
        <strong>
            {{ message }}
            <span class="fa fa-refresh fa-spin fa-lg"></span>
        </strong>
    </div>
        
    <div class="row">
        <div class="col-3" id="left">
            <selection></selection>
        </div>
        <div class="col-9" id="right">
            <transition name="fade" mode="out-in">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
    </div>
</div>
</template>

<script>
import 'bootstrap'
import { mapActions } from 'vuex'
import Selection from '../components/Selection'

export default {
    components: {
        Selection
    },

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
@import "../../node_modules/webui-popover/dist/jquery.webui-popover.min.css";

html {
    height: 100%;
}

body {
    font-size: 14px;
    background-color: #eee;
    height: 100%;
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

.btn {
    cursor: pointer;
    position: relative;
    -webkit-transition: initial;
       -moz-transition: initial;
            transition: initial;
}

.btn-primary, .btn-success, .btn-danger {
    border-width: 0 1px 2px 1px;
}

.btn-primary:active, .btn-success:active, .btn-danger:active {
    border-width: 2px 1px 0 1px;
}

.btn-primary { border-color: #01549b; }
.btn-primary:hover { background-color: #0275d8; }
.btn-success { border-color: #419641; }
.btn-success:hover { background-color: #5cb85c; }
.btn-danger { border-color: #c12e2a; }
.btn-danger:hover { background-color: #d9534f; }

.btn:focus {
    box-shadow: inherit;
}

.btn-sm {
    padding: .5rem;
}

.btn-xs {
    padding: .3rem 1rem;
}

.rounded {
    border-radius: .25rem !important;
}

.text-primary {
    color: #31708f !important;
}

#app {
}

.webui-popover .webui-popover-content>div:first-child {
    width: 100%;
}

.back a {
    color: #444;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .2s ease;
}

.fade-enter, .fade-leave-active {
    opacity: 0;
}

#left {
    padding-left: 0;
    padding-right: 0;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    height: 100vh;
    background-color: #F4F4F4;
}

#right {
    border-right: 1px solid #ccc;
    padding: 0;
    overflow-y: auto;
    max-height: 100vh;
}

#right > div.card {
    border-left: 0;
}
</style>

<style scoped>
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
</style>