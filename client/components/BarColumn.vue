<template>
<td class="align-middle">
    <div v-if="labelText !== 'NA'" 
         :style="{'background-color': color, 'height': `${percentage}%`}">
    </div>
    <span class="text-center" :class="{ 'text-muted': labelText === 'NA' }">
        {{ labelText }}
    </span>
</td>
</template>

<script>
export default {
    props: {
        percentage: Number,
        color: String,
        label: [String, Number]
    },

    computed: {
        labelText() {
            if (this.label !== undefined) return this.label
            if (this.percentage !== null) return `${this.percentage.toFixed(2)}%`
            return 'NA'
        }
    }
}
</script>

<style scoped>
td {
    position: relative;
}

td > div {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: .5;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

td > span {
    display: block;
}
</style>