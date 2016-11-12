<template>
<div class="row">
    <div class="col-xs-4" style="padding-right: .5rem;">
        <!--<div class="card card-block card-inverse card-primary info-card" id="assembly-card">
            <span class="name">{{ assembly.name }}</span>
            <button type="button" class="btn btn-link float-xs-right">
                <span class="fa fa-trash text-danger"></span>
            </button>
            <button type="button" class="btn btn-link float-xs-right">
                <span class="fa fa-pencil text-primary"></span>
            </button>
        </div>
        <hr>-->
        <bin-set></bin-set>
    </div>
    <div class="col-xs-8" style="padding-left: 0;">
        <bin v-if="bin"></bin>
        <div class="text-xs-center" id="select-message" v-show="!bin">
            <span class="fa fa-inbox fa-4x text-muted"></span>
            <span class="text-muted lead">Select a bin on the left<span>
        </div>
    </div>
</div>
</template>

<script>
import BinSet from '../components/BinSet'
import Bin from '../components/Bin'

export default {
    components: {
        BinSet,
        Bin
    },
    
    computed: {
        assembly() {
            return this.$store.state.assembly
        },
        bin() {
            return this.$store.state.bin
        }
    }
}
</script>

<style>
.name {
    font-size: 1.5rem;
}

.name::before {
    color: #777;
    font-size: small;
}

#assembly-card {
    background-color: white;
}

#assembly-card > span.name::before {
    content: "Assembly ";
}

.info-card {
    border-left-width: 3px;
}

.name-block {
    padding: 0;
}

.action-buttons {
    opacity: .1;
    transition: opacity .15s ease-in-out;
}

.action-buttons .btn {
    padding: .5rem .75rem;
}

.info-card:hover .action-buttons {
    opacity: 1;
}

#select-message {
    margin-top: 6em;
}

#select-message > span {
    display: block;
}
</style>