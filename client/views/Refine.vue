<template>
<div class="card" id="refine">
    <scatter></scatter>
</div>
</template>

<script>
import Scatter from '../charts/Scatter'

export default {
    components: {
        Scatter,
    }
}
</script>

<style>
#refine {
    border-right: 0;
    min-height: 100vh;
}
</style>