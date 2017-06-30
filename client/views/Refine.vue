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
                    {{ binSet.name }}
                </strong>
            </div>
            <div></div>
        </div>
        
        <div style="border-width: 0 0 1px 0">
            <div class="card-header" style="background: #F4F4F4">
                <ul class="nav justify-content-center card-header-tabs">
                    <li class="nav-item">
                        <a class="nav-link" href="#" 
                            :class="{active: refinementTab === 'PlotTab'}"
                            @click.prevent="refinementTab = 'PlotTab'">
                            <span class="fa fa-line-chart"></span>
                            Plot
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"
                            :class="{active: refinementTab === 'RefineTab'}"
                            @click.prevent="refinementTab = 'RefineTab'">
                            <span class="fa fa-wrench"></span>
                            Refine
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"
                            :class="{active: refinementTab === 'BinsTab'}"
                            @click.prevent="refinementTab = 'BinsTab'">
                            <span class="fa fa-list"></span>
                            Bins
                        </a>
                    </li>
                </ul>
            </div>
            <div class="tab-body">
                <component 
                    :is="refinementTab"
                    
                    :xData_.sync="xData"
                    :yData_.sync="yData"
                    :colorBy_.sync="colorBy"
                    :colorBinSet_.sync="colorBinSet"
                    :xLog_.sync="xLog"
                    :yLog_.sync="yLog">
                </component>
            </div>
        </div>
    </div>
    <div class="col-9 app-right" style="background-color: white;">
        <div id="refine-status">
            <span class="text-muted" v-if="selectedContigs.length === 0">
                [Click and drag to select region.]
            </span>
            <span class="text-muted" v-else>
                [{{ selectedContigs.length }} selected. Right-click to deselect.]
            </span>
        </div>
        <scatter
            :xData="xData"
            :yData="yData"
            :xLog="xLog"
            :yLog="yLog"
            :colorBy="colorBy"
            :colorBinSet="colorBinSet">
        </scatter>
    </div>
    <refine-export-modal
        :xData="xData"
        :yData="yData"
        :xLog="xLog"
        :yLog="yLog"
        :colorBy="colorBy"
        :colorBinSet="colorBinSet">
    </refine-export-modal>

    <footer-section></footer-section>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Scatter from '../charts/Scatter'
import PlotTab from '../components/PlotTab'
import RefineTab from '../components/RefineTab'
import BinsTab from '../components/BinsTab'
import RefineExportModal from '../components/RefineExportModal'
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
            yLog: false
        }
    },
    
    components: {
        Scatter,
        PlotTab,
        RefineTab,
        BinsTab,
        RefineExportModal,
        FooterSection
    },

    computed: {
        ...mapState([
            'binSet',
            'refineBinSet',
            'selectedContigs'
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

.nav-link.active {
    color: #444;
    font-weight: 500;
}

.nav-link:not(.active) {
    color: #636c72 !important;
}

#refine-status {
    position: absolute;
    left: 3rem;
    top: .25rem;
    pointer-events: none;
    font-size: small;
}
</style>