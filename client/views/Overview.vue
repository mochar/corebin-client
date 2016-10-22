<template>
<div class="row">
    <div class="col-xs-5">
        <!--<div class="card card-block card-outline-secondary info-card" id="assembly-card">
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
    <div class="col-xs-7" style="padding-left: 0;">
        <bin></bin>
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
    opacity: .2;
    transition: opacity .15s ease-in-out;
}

.action-buttons .btn {
    padding: .5rem .75rem;
}

.info-card:hover .action-buttons {
    opacity: 1;
}
</style>