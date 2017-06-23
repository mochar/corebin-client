<template>
<div id="footer">
    <div>
        <small><router-link to="/home"><img src="logo.svg" id="logo-home" /> Home</router-link></small> |
        <small><router-link to="/help">Stuck or need more info?</router-link></small> <br>
    </div>
    <small class="text-muted">Developed by Mohammed Charrout</small> <br>
    <small class="text-muted">Project-coordinator Lex Overmars</small>
</div>
</template>

<style>
#footer {
    position: fixed;
    bottom: .5rem;
    padding: 1rem;
}

#logo-home {
    height: 1.5rem;
}
</style>