<template>
<td class="align-middle">
    <div :style="{'background-color': color, 'height': `${percentage}%`}"></div>
    <span class="text-center">
        {{ labelText }}
    </span>
</td>
</template>

<script>
export default {
    props: ['percentage', 'color', 'label'],

    computed: {
        labelText() {
            return this.label ? this.label : `${this.percentage}%`
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