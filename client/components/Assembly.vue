<template>
    <div>
        <p>{{ assemblyName }}</p>
        <input v-model="assemblyName">
        <button @click="addAssembly">Add</button>
        
        <ul>
            <li v-for="assembly in assemblies">
                {{ assembly.name }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            assemblyName: ''
        }
    },
    
    computed: {
        assemblies() {
            return this.$store.state.assemblies
        }
    },

    methods: {
        addAssembly() {
            this.$store.commit('ADD_ASSEMBLY', { name: this.assemblyName })
            this.assemblyName = ''
        }
    }
}
</script>

<style>
</style>
