<template>
    <div id="app">
        <p>
            <router-link to="/">Home</router-link>
            <router-link to="/overview">Overview</router-link>
            <router-link to="/compare">Compare</router-link>
            <router-link to="/refine">Refine</router-link>
            <router-link to="/help">Help</router-link>
        </p>
        <router-view></router-view>
    </div>
</template>

<style>
</style>
