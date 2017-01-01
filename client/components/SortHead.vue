<template>
<div>
    <div v-if="by == name">
        <strong @click="sort">{{ label }}</strong>
        <span class="fa" :class="`fa-sort-${order}`"></span>
    </div>
    <span @click="sort" v-else>{{ label }}</span>
</div>
</template>

<script>
export default {
    props: ['label', 'name', 'by', 'order'],

    methods: {
        sort() {
            this.$emit('sort')
        }
    }
}
</script>