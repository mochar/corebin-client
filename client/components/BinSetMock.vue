<template>
<div class="list-group-item list-group-item-action flex-column align-items-start bin-set">
    <div class="bin-colors">
        <div 
            v-for="bin in binSet.colors" 
            style="display: inline-block"
            :key="bin.id" 
            :style="{'width': `${bin.percentage*100}%`, 'background-color': bin.color}">
        </div>
    </div>

    <div class="name-div w-100 d-flex justify-content-between align-items-baseline">
        <span class="name">{{ binSet.name }}</span>
    </div>

    <div class="card-body" style="padding: .15rem 1rem .5rem;">
    </div>

    <div class="bin-set-bar text-muted d-flex justify-content-between align-items-baseline">
        <small class="text-muted" style="padding-left: 0rem">
            Added {{ binSet.submitDate }} ago
        </small>

        <div>
            <button 
                class="btn btn-secondary btn-sm action-btn text-primary-hover"
                style="border-left: 0; border-right: 0">
                <span class="fa fa-download"></span>
            </button>
            <button class="btn btn-secondary btn-sm action-btn text-primary-hover">
                <span class="fa fa-pencil"></span>
            </button>
            <button class="btn btn-secondary btn-sm action-btn text-danger-hover">
                <span class="fa fa-trash"></span>
            </button>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['binSet']
}
</script>