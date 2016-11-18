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
        
        <div class="card info-card" style="border-width: 1px">
            <div class="card-block name-block">
                <span class="name" id="bin-set-name">{{ binSet.name }}</span>
                <div class="dropdown float-xs-right">
                    <button class="btn btn-secondary dropdown-toggle open-menu" data-toggle="dropdown">
                        <span class="fa fa-ellipsis-v"></span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a class="dropdown-item" href="#">
                            <span class="fa fa-fw fa-pencil text-primary"></span> Rename
                        </a>
                        <a class="dropdown-item" href="#">
                            <span class="fa fa-fw fa-trash text-danger"></span> Delete
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="card-block">
                <dl class="row">
                    <dt class="col-xs-9 text-muted">Bins</dt>
                    <dd class="col-xs-3">{{ bins.length }}</dd>
                    
                    <dt class="col-xs-9 text-muted">Binned contigs</dt>
                    <dd class="col-xs-3">{{ bins.length }}</dd>
                    
                    <dt class="col-xs-9 text-muted">Unbinned contigs</dt>
                    <dd class="col-xs-3">{{ bins.length }}</dd>
                </dl>
                
                <div class="input-group ">
                    <input type="text" class="form-control form-control-sm" placeholder="New bin">
                    <span class="input-group-btn">
                        <button class="btn btn-sm btn-outline-primary">Add</button>
                    </span>
                </div>
            </div>
            
            <router-link to="/refine" class="btn btn-sm btn-primary btn-block">
                <span class="fa fa-cog"></span> Refine bins
            </router-link>
        </div>
    </div>
    
    <div class="col-xs-9 card" id="bins">
        <div class="card-header" style="padding: 0;">
            <div class="row float-xs-right" id="bins-header">
                <strong class="col-xs-5 text-xs-center align-middle">Sort by</strong>
                <div class="col-xs-7">
                    <select class="custom-select btn-sm" v-model="sortBy">
                        <option value="size">Size</option>
                        <option value="gc">GC</option>
                        <option value="contamination">Contamination</option>
                        <option value="completeness">Completeness</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div id="bins-body">
            <bin 
                v-for="bin in sortedBins"
                :key="bin.id"
                :bin="bin"
                :maxSize="maxSize"
                :minSize="minSize">
            </bin>
        </div>
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
            return this.bins.sort((a, b) => a[this.sortBy] < b[this.sortBy])
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
    max-height: 95vh;
}

#bins-header {
}

#bins-body {
    overflow-y: scroll;
    padding-right: 1rem;
    max-height: 90vh;
}
</style>