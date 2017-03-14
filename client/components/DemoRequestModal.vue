<template>
<div class="modal" id="demo-modal" tabindex="-1">
<div class="modal-dialog modal-lg">
<div class="modal-content">
<div class="modal-body">

    <h5 class="modal-title">Demo data-set</h5>

    <div class="card-block">
        <table style="border-spacing: 10px; border-collapse: separate;">
            <tr style="font-weight: bolder;">
                <td>Organism</td>
                <td>GC%</td>
                <td>Length (Mb)</td>
                <td>Sample 1</td>
                <td>Sample 2</td>
                <td>Sample 3</td>
            </tr>
            <tr>
                <td><i>Bacillus subtilis</i> subsp. <i>subtilis</i> str. 168</span></td>
                <td>43.51</td>
                <td>4.22</td>
                <td>0.15</td>
                <td>0.1</td>
                <td>0.11</td>
            </tr>
            <tr>
                <td><i>Escherichia coli</i> K12 substr. MG1655</td>
                <td>50.79</td>
                <td>4.64</td>
                <td>0.02</td>
                <td>0.04</td>
                <td>0.14</td>
            </tr>
            <tr>
                <td><i>Salmonella enterica</i> subsp. <i>enterica serovar Typhimurium</i> str. LT2</span></td>
                <td>52.22</td>
                <td>4.86</td>
                <td>0.2</td>
                <td>0.23</td>
                <td>0.193</td>
            </tr>
            <tr>
                <td><i>Shigella flexneri</i>  2a str. 2457T</td>
                <td>50.9</td>
                <td>4.61</td>
                <td>0.14</td>
                <td>0.13</td>
                <td>0.092</td>
            </tr>
            <tr>
                <td><i>Thioalkalivibrio sp.</i> K90mix</td>
                <td>65.9</td>
                <td>2.74</td>
                <td>0.06</td>
                <td>0.1</td>
                <td>0.075</td>
            </tr>
            <tr>
                <td><i>Lactococcus lactis</i> subsp. <i>lactis</i> Il1403</span></td>
                <td>35.3</td>
                <td>2.37</td>
                <td>0.02</td>
                <td>0.01</td>
                <td>0</td>
            </tr>
            <tr>
                <td><i>Lactobacillus plantarum</i> WCFS1</td>
                <td>44.5</td>
                <td>3.31</td>
                <td>0.17</td>
                <td>0.13</td>
                <td>0.14</td>
            </tr>
            <tr>
                <td><i>Desulfovibrio vulgaris</i> str. Hildenborough</td>
                <td>67.1</td>
                <td>3.57</td>
                <td>0.08</td>
                <td>0.07</td>
                <td>0.11</td>
            </tr>
            <tr>
                <td><i>Streptococcus pneumoniae</i> R6</td>
                <td>39.7</td>
                <td>2.04</td>
                <td>0.05</td>
                <td>0.03</td>
                <td>0.01</td>
            </tr>
            <tr>
                <td><i>Rhodobacter sphaeroides</i> ATCC 1702</td>
                <td>68.5</td>
                <td>3.22</td>
                <td>0.11</td>
                <td>0.16</td>
                <td>0.13</td>
            </tr>
        </table>
    </div>

    <div>
        <button
            class="btn btn-link btn-sm"
            @click.prevent="hide">Cancel
        </button>
    
        <button @click="requestDemo" class="btn btn-primary pull-right submit-button btn-sm" :disabled="loading">
            <span class="fa fa-refresh fa-spin" v-show="loading"></span>
            Load demo
        </button>
    </div>

</div>
</div>
</div>
</div>
</template>

<script>
export default {
    data() {
        return {
            loading: false
        }
    },

    methods: {
        requestDemo() {
            this.loading = true
            return $.getJSON(`${ROOTURL}/demo`, (data, status, xhr) => {
                const job = { location: xhr.getResponseHeader('Location'), meta: data }
                this.$store.commit('SET_JOBS', [job])
                this.loading = false
                this.hide()
            })
        },
        hide() {
            $(this.$el).modal('hide')
        }
    }
}
</script>
