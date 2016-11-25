<template>
<div class="card" id="bins">
    <div class="card-header">
        <button class="btn btn-primary btn-sm btn-header">
            <span class="fa fa-plus"></span>
            Add bin
        </button>
        <div class="dropdown float-xs-right">
            <button class="btn btn-outline-secondary btn-sm dropdown-toggle btn-header" 
                    data-toggle="dropdown" id="sort-button">
                <strong>Sort by</strong>
                {{ sortBy }}
            </button>
            <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#" @click.prevent="sortBy = 'size'">Size</a>
                <a class="dropdown-item" href="#" @click.prevent="sortBy = 'gc'">GC</a>
                <a class="dropdown-item" href="#" @click.prevent="sortBy = 'contamination'">Contamination</a>
                <a class="dropdown-item" href="#" @click.prevent="sortBy = 'completeness'">Completeness</a>
            </div>
        </div>
    </div>
    
    <div id="bins-body">
        <transition-group name="list">
            <bin 
                v-for="bin in sortedBins"
                :key="bin.id"
                :bin="bin"
                :maxSize="maxSize"
                :minSize="minSize">
            </bin>
        </transition-group>
    </div>
</div>
</template>

<script>
import Bin from '../components/Bin'

export default {
    data() {
        return {
            sortBy: 'size'
        }
    },

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
        },
        sortedBins() {
            return this.bins.sort((a, b) => a[this.sortBy] - b[this.sortBy])
        }
    }
}
</script>

<style scoped>
.list-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-enter, .list-leave-active {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute;
}
</style>

<style>
.name {
    font-size: 1.5rem;
    margin-left: 1rem;
}

.name::before {
    color: #777;
    font-size: small;
}

.info-card {
    border-left-width: 3px;
}

.name-block {
    padding: 0;
}

#bin-set-name::before {
    content: "Bin set ";
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

#bins {
    padding: 0;
}

#bins > div.card-header {
    background-color: white;
    padding: .25rem 1rem;
}

#bins-body {
    overflow-y: scroll;
    padding-right: 1rem;
    max-height: 95vh;
}

#sort-button {
    color: inherit;
}

.btn-header {
    font-size: .8rem;
}
</style>