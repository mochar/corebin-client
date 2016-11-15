<template>
<div class="row">
    <div class="col-xs-3">
        <div class="card card-outline-secondary">
            <nav class="nav nav-pills nav-stacked back">
                <router-link to="/home" class="nav-link">
                    <span class="fa fa-arrow-left"></span>
                    Return to Home
                </router-link>
            </nav>
        </div>
    </div>
    <div class="col-xs-9" id="bins-section">
        <bin 
            v-for="bin in bins"
            :bin="bin"
            :maxSize="maxSize"
            :minSize="minSize">
        </bin>
    </div>
</div>
</template>

<script>
import Bin from '../components/Bin'

export default {
    components: {
        Bin
    },
    
    computed: {
        binSet() {
            return this.$store.state.binSet
        },
        bins() {
            return this.$store.state.bins
        },
        maxSize() {
            return Math.max(...this.bins.map(bin => bin.size))
        },
        minSize() {
            return Math.min(...this.bins.map(bin => bin.size))
        }
    }
}
</script>

<style>
.name {
    font-size: 1.5rem;
    margin-left: 1rem;
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

#bins-section {
    overflow-y: scroll;
    padding-right: 2rem;
    max-height: 95vh;
}
</style>