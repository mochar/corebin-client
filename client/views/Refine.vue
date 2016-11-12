<template>
<div class="row">
    <div class="col-xs-4">
        <div class="card">
            <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs float-xs-left">
                    <li class="nav-item">
                        <a class="nav-link" :class="{active: tab==='bins'}" href="#"
                            @click.prevent="tab = 'bins'">Bins</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :class="{active: tab==='selection'}" href="#"
                            @click.prevent="tab = 'selection'">Selection</a>
                    </li>
                </ul>
            </div>
            <div class="card-block">
                Sup
            </div>
            <ul class="list-group list-group-flush">
                <li v-for="bin in bins" class="list-group-item" :style="{ 'border-left-color': bin.color }">
                    {{ bin.name }}
                    <div class="float-xs-right">
                        <a href="#">view</a> |
                        <a href="#">plot</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div class="col-xs-8">
        <div class="card">
            <scatter
                :contigs="contigs"
                :xData="xData"
                :yData="yData"
            ></scatter
        </div>
    </div>
</div>
</template>

<script>
import Scatter from '../charts/Scatter'

export default {
    data() {
        return {
            tab: 'bins',
            contigs: [],
            xData: 'gc',
            yData: 'length'
        }
    },
    
    components: {
        Scatter
    },

    computed: {
        bins() {
            return this.$store.state.bins
        }
    }
}
</script>

<style>
.card-header-tabs {
    margin-bottom: -.5rem;
}
</style>

<style scoped>
.card-header {
    background-color: white;
}

.nav li > a {
    color: #555;
}

.nav li a:hover, .nav li.dropdown a:focus {
    background-color: white;
}

.list-group-item {
    border-left-width: 3px;
    border-left-style: solid;
    padding: .5rem 1rem;
}
</style>