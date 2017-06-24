<template>
<popover :options="{ placement: 'right', trigger: 'hover', delay: {hide:0} }">
    <button slot="button" class="btn-link">
        <span class="fa fa-info"></span>
    </button>
    <div slot="body" class="d-flex">
        <div class="d-flex flex-column p-1">
            <span class="desc"># contigs</span>
            <span class="desc">Size (Mbp)</span>
            <span class="desc">GC</span>
            <span class="desc">Contamination</span>
            <span class="desc">Completeness</span>
        </div>

        <div class="d-flex flex-column p-1">
            <span>{{ bin.size }}</span>
            <span>{{ bin.mbp }}</span>
            <span>{{ bin.gc*100 }}%</span>
            <span>{{ bin.contamination*100 }}%</span>
            <span>{{ bin.completeness*100 }}%</span>
        </div>
    </div>
</popover>
</template>

<script>
import Popover from 'components/Popover'

export default {
    props: ['bin'],

    components: {
        Popover
    }
}
</script>

<style>
.desc {
    font-weight: 500;
    text-align: right;
}
</style>
