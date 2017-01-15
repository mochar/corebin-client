<template>
<div>
    <span>Selected contigs: {{ contigs.length }}</span>
</div>
</template>

<script>
export default {
    props: ['contigs']
}
</script>