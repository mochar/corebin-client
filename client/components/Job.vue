<template>
<div class="card">
    <div class="name-block">
        <span class="name">{{ job.meta.name }}</span>
    </div>

    <div class="card-block" style="padding: .15rem 1rem 1rem 1rem;">
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated"
                 style="width: 100%">
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['job']
}
</script>

<style scoped>
.card {
    border-width: 1px 0;
}
</style>