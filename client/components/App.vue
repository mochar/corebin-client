<template>
<div class="container" id="app">
    <ul class="nav nav-pills">
        <li class="nav-item">
            <router-link to="/home" active-class="active" class="nav-link">
                <span class="fa fa-lg fa-home"></span>
            </router-link>
        </li>
        <li class="nav-item">
            <router-link to="/overview" active-class="active" class="nav-link">
                <span class="fa fa-eye"></span> Overview
            </router-link>
        </li>
        <li class="nav-item">
            <router-link to="/compare" active-class="active" class="nav-link">
                <span class="fa fa-balance-scale"></span> Compare
            </router-link>
        </li>
        <li class="nav-item">
            <router-link to="/refine" active-class="active" class="nav-link">
                <span class="fa fa-cog"></span> Refine
            </router-link>
        </li>
        <li class="nav-item">
            <router-link to="/help" active-class="active" class="nav-link">
                <span class="fa fa-question-circle"></span> Help
            </router-link>
        </li>
        
        <div class="float-xs-right">
            <li class="nav-item dropdown" v-if="assembly">
                <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">
                    <strong>Assembly </strong>
                    <span>{{ assembly.name }}</span>
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                    <router-link v-for="a in assemblies" :class="{ disabled: a.id === assembly.id }" 
                                class="dropdown-item" to="/overview" @click.native="selectAssembly(a)">
                        {{ a.name }}
                    </router-link>
                </ul>
            </li>
            
            <li class="nav-item dropdown" v-if="binSet">
                <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">
                    <strong>Bin set </strong>
                    <span>{{ binSet.name }}</span>
                    <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                    <router-link v-for="bs in binSets" :class="{ disabled: bs.id === binSet.id }" 
                                class="dropdown-item" to="/overview" @click.native="selectBinSet(bs)">
                        {{ bs.name }}
                    </router-link>
                </ul>
            </li>
        </div>
    </ul>
    
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import 'bootstrap'

export default {
    data() {
        return {
            show: true
        }
    },  
    
    methods: {
        ...mapMutations({
            selectAssembly: 'SELECT_ASSEMBLY',
            selectBinSet: 'SELECT_BIN_SET'
        })
    },
    
    computed: {
        assembly() {
            return this.$store.state.assembly
        },
        assemblies() {
            return this.$store.state.assemblies
        },
        binSet() {
            return this.$store.state.binSet
        },
        binSets() {
            return this.$store.state.binSets
        }
    }
}
</script>

<style>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../../node_modules/font-awesome/css/font-awesome.min.css";

body {
    font-size: 14px;
    background-color: #eee;
}

* {
    -webkit-border-radius: 0 !important;
    -moz-border-radius: 0 !important;
    border-radius: 0 !important;
}

input[type="file"] {
    width: 100%;
    padding: .1rem 0;
    font-size: .9em;
}

.card-header {
    padding: .5em;
    padding-left: 1em;
    color: white;
    background-color: #3b668b;
}

.form-group > label {
    font-weight: bold;
    margin-bottom: .25rem;
}

.btn-sm {
    padding: .5rem;
}

.text-primary {
    color: #31708f !important;
}

#app {
    margin-top: .5em;
    padding: 0;
}

#app > ul {
    color: white;
    background-color: #3b668b;
    margin-bottom: .5em;
    border: 1px solid #3b668b;
}

.nav li > a {
  color: white;
}

.nav li a:hover,
.nav li.dropdown a:focus {
  background-color: steelblue;
  color: white;
}

.nav-link.active {
    color: #555 !important;
    font-weight: bold;
    background-color: white !important;
}

.nav li.disabled a,
.nav li.disabled a:hover {
  color:#bac0c3;
}

.nav-item.open .nav-link {
    background-color: steelblue !important;
}
</style>
