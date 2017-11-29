<template>
<div class="row" id="refine">
    <div class="col-3 app-left">
        <div class="navigation">
            <div class="sidebar-button" @click="$router.go(-1)">
                <span class="fa fa-angle-left fa-lg text-muted" style="font-weight: bold"></span>
            </div>
            <div>
                <strong class="sidebar-title text-muted text-center" style="padding-bottom: 0">
                    REFINEMENT
                </strong>
                <strong class="sidebar-sub text-muted text-center">
                    {{ refineBinSet.name }}
                </strong>
            </div>
            <div></div>
        </div>
        
        <div class="card card2 mt-3">
            <ul class="nav nav-pills nav-fill pl-2 pr-2 pt-1">
                <li class="nav-item">
                    <a class="nav-link" href="#" 
                        :class="{active: refinementTab === 'PlotTab'}"
                        @click.prevent="refinementTab = 'PlotTab'">
                        <span class="fa fa-fw fa-line-chart"></span>
                        Plot
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#"
                        :class="{active: refinementTab === 'RefineTab'}"
                        @click.prevent="refinementTab = 'RefineTab'">
                        <span class="fa fa-fw fa-wrench"></span>
                        Refine
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#"
                        :class="{active: refinementTab === 'BinsTab'}"
                        @click.prevent="refinementTab = 'BinsTab'">
                        <span class="fa fa-fw fa-list"></span>
                        Bins
                    </a>
                </li>
            </ul>

            <component 
                :is="refinementTab"
                
                :xData_.sync="xData"
                :yData_.sync="yData"
                :colorBy_.sync="colorBy"
                :colorBinSet_.sync="colorBinSet"
                :xLog_.sync="xLog"
                :yLog_.sync="yLog"
                :plot_.sync="plot"
                :show-more_.sync="showMore"
                :even-resolution_.sync="evenResolution">

                <button class="btn btn-light btn-sm btn-bin float-right" @click="downloadPlot" slot="export-btn">
                    <span class="fa fa-download"></span>
                    Export
                </button>
            </component>
        </div>
    </div>
    <div class="col-9 app-right d-flex" style="background-color: #fff6; overflow: hidden">
        <scatter
            id="scatter"
            :xData="xData"
            :yData="yData"
            :xLog="xLog"
            :yLog="yLog"
            :colorBy="colorBy"
            :colorBinSet="colorBinSet"
            :plot.sync="plot"
            :evenResolution="evenResolution">
        </scatter>
    </div>
    <footer-section></footer-section>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Scatter from 'charts/Scatter'
import PlotTab from 'components/RefineTabs/PlotTab'
import RefineTab from 'components/RefineTabs/RefineTab'
import BinsTab from 'components/RefineTabs/BinsTab'
import FooterSection from 'components/FooterSection'

export default {
    data() {
        return {
            refinementTab: 'PlotTab',
            xData: 'gc',
            yData: 'length',
            colorBy: 'binSet',
            colorBinSet: null,
            xLog: false,
            yLog: false,
            plot: false,
            showMore: false,
            evenResolution: false
        }
    },
    
    components: {
        Scatter,
        PlotTab,
        RefineTab,
        BinsTab,
        FooterSection
    },

    methods: {
        downloadPlot() {
            const svgEl = $(this.$el).find('svg')[0]
            this.$helpers.downloadSvg(svgEl, 'refine_plot')
        }
    },

    computed: {
        ...mapState([
            'binSet',
            'refineBinSet'
        ])
    },

    watch: {
        refineBinSet() {
            this.xData = 'gc'
            this.yData = 'length'
            this.xLog = false
            this.yLog = false
            this.colorBinSet = this.refineBinSet.id
        }
    },

    created() {
        this.colorBinSet = this.binSet.id
    }
}
</script>

<style>
#refine {
    /*border-right: 0;
    min-height: 100vh;
    max-height: 100vh;*/
}

.tab-body {
    max-height: 75vh;
    overflow-y: auto;
    display: block;
}

#scatter {
    box-shadow: rgb(236, 236, 236) 1px 2px 2px 1px, 
                rgb(236, 236, 236) -1px -2px 2px 1px;
    background-color: white;
    display: block;
    position: relative;
    margin: auto;
}
</style>

<style scoped>
.nav-link.active {
    border-bottom: 2px solid #444;
}
.nav-item .active {
    font-weight: normal;
    background-color: inherit;
}
</style>