<template>
<popover :options="{ placement: 'right', trigger: 'hover', delay: {hide:0} }">
    <span slot="button" class="text-primary">
        <span class="fa fa-fw fa-info"></span>
    </span>
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
            <span>{{ bin.mbp.toFixed(3) }}</span>
            <span>{{ (bin.gc*100).toFixed(2) }}%</span>
            <span>{{ (bin.contamination*100).toFixed(2) }}%</span>
            <span>{{ (bin.completeness*100).toFixed(2) }}%</span>
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
