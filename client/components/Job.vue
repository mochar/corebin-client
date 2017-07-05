<template>
<div class="card job">
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
                {{ job.meta.status || 'Saving' }}
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

<style>
.job {
    border-color: #ccc;
    padding: 0;
    margin: .1rem .3rem;
    width: initial;
    box-shadow: 1px 2px 2px 1px #eee;
}
</style>