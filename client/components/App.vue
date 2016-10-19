<template>
    <div class="container" id="app">
        <p>
            <router-link to="/">Home</router-link>
            <router-link to="/overview">Overview</router-link>
            <router-link to="/compare">Compare</router-link>
            <router-link to="/refine">Refine</router-link>
            <router-link to="/help">Help</router-link>
        </p>
        <button type="button" class="btn btn-outline-primary">
            <span class="fa fa-cog fa-spin"></span>
            Primary
        </button>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: true
        }
    }
}
</script>

<style>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../../node_modules/font-awesome/css/font-awesome.min.css";
</style>
