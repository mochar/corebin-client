<template>
<div class="card">
    <div class="name-block">
        <span class="name">{{ job.meta.name }}</span>
    </div>

    <div class="card-block" style="padding: .15rem 1rem;">
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated"
                 style="width: 100%">
            </div>
        </div>

        <p class="card-text" style="margin-top: .5rem">
            <small class="text-muted">
                <span class="fa fa-refresh fa-spin"></span>
                {{ job.meta.status }}
            </small>
        </p>
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