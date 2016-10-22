<template>
<div class="card info-card" id="bin-card" :style="{ 'border-color': bin.color }">
    <div class="row">
        <div class="col-xs-5">
            <div class="card-block name-block">
                <span class="name" id="bin-name">{{ bin.name }}</span>
                <div class="action-buttons float-xs-right">
                    <button type="button" class="btn btn-link">
                        <span class="fa fa-pencil text-primary"></span>
                    </button>
                    <button type="button" class="btn btn-link">
                        <span class="fa fa-trash text-danger"></span>
                    </button>
                </div>
            </div>
            
            <div class="card-block" id="content-card">
                <h6><span class="fa fa-cog fa-lg fa-pull-right"></span> Actions</h6>
                <hr style="margin-top: 0">
                <ul>
                    <li>
                        <a href="#" @click.prevent="">Assess quality</a>
                    </li>
                    <li>
                        <a href="#refine" @click="">Refine</a>
                    </li>
                    <li>
                        <a href="#compare" @click="">Compare</a>
                    </li>
                </ul>

                <h6 style="margin-top: 23px"><span class="fa fa-tasks fa-lg fa-pull-right"></span> Contigs</h6>
                <hr style="margin-top: 0">
            </div>
        </div>
        <div class="col-xs-7">
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    
    computed: {
        bins() {
            return this.$store.state.bins
        },
        bin() {
            return this.$store.state.bin
        },
    },

    methods: {
    }
}
</script>

<style>
#bin-card {
}

#content-card {
    padding: 1.5rem .75rem;
    border-right: 1px solid #eee;
}

#bin-name::before {
    content: "Bin ";
}
</style>
