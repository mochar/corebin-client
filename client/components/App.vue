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
            <!--<transition name="fade" mode="out-in">-->
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            <!--</transition>-->
        </div>
    </div>

    <assembly-upload-modal></assembly-upload-modal>
    <bin-set-upload-modal></bin-set-upload-modal>
    <open-refine-modal></open-refine-modal>
    <demo-request-modal></demo-request-modal>
    <refine-modal></refine-modal>
    <assembly-modal></assembly-modal>
    <refine-export-modal></refine-export-modal>
</div>
</template>

<script>
import 'bootstrap'
import { mapActions } from 'vuex'
import Selection from '../components/Selection'
import AssemblyUploadModal from '../components/AssemblyUploadModal'
import BinSetUploadModal from '../components/BinSetUploadModal'
import OpenRefineModal from '../components/OpenRefineModal'
import DemoRequestModal from '../components/DemoRequestModal'
import RefineModal from '../components/RefineModal'
import AssemblyModal from '../components/AssemblyModal'
import RefineExportModal from '../components/RefineExportModal'

export default {
    components: {
        Selection,
        AssemblyUploadModal,
        BinSetUploadModal,
        OpenRefineModal,
        DemoRequestModal,
        RefineModal,
        AssemblyModal,
        RefineExportModal
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
    },

    mounted() {
        $('[data-toggle="tooltip"]').tooltip()
    }
}
</script>

<style>
@import "../../node_modules/webui-popover/dist/jquery.webui-popover.min.css";
@import "../../node_modules/font-awesome/css/font-awesome.min.css";
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700');

html {
    height: 100%;
}

body {
    font-size: 14px;
    background-color: #eee;
    height: 100%;
}

body, button, input, optgroup, select, textarea {
    font-family: 'Roboto', sans-serif;
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

.btn-primary { border-color: #01549b; }
.btn-primary:hover, .btn-primary:active { background-color: #0275d8; }
.btn-success { border-color: #419641; }
.btn-success:hover, .btn-success:hover { background-color: #5cb85c; }
.btn-danger { border-color: #c12e2a; }
.btn-danger:hover, .btn-danger:active { background-color: #d9534f; }
.btn-secondary { border-color: #adadad; }
.btn-secondary:hover, .btn-secondary:active { background-color: #fff;  }

.btn:hover:not(:disabled) {
    top: -1px;
    box-shadow: 0px 1px 1px 0px #eee;
}
.btn:active { top: 1px !important; }
.btn:focus { box-shadow: inherit; }
.btn:focus:hover:not(:active) {
    top: 0px !important;
}

a:active, .btn-link:active {
    color: #333;
}

.fw-500 {
    font-weight: 500;
    letter-spacing: .025rem;
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

.text-danger-hover:hover {
    color: #d9534f !important;
    font-weight: 500;
}
.text-primary-hover:hover {
    color: #31708f !important;
    font-weight: 500;
}

.vue-color__compact {
    box-shadow: 0 0 0 0 !important;
}

#app {
}

.submit-button {
    padding: .25rem 1.5rem !important;
}

.webui-popover .webui-popover-content>div:first-child {
    width: 100%;
}

/* Patch annoying webui behaviour */
.webui-popover .dropdown-menu {
    position: absolute;
    top: 100%;
    display: none;
    float: left;
    border: 1px solid rgba(0,0,0,.15);
}

.show > .dropdown-menu {
    display: block;
}
/* end patch */

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
    overflow-x: hidden;
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

.dropdown-menu-sm {
    font-size: .9rem;
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