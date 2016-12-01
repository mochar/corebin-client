<template>
<div>
    <svg :width="width" :height="height">
        <g :transform="gTransform">
            <transition-group name="flip" tag="g" class="groups">
                <path
                    v-for="group in chordData.groups"
                    :key="group.index"
                    :style="{ stroke: '#000000', fill: binsMap.get(group.data).color }"
                    :d="arc.startAngle(group.startAngle).endAngle(group.endAngle)()"
                    @mouseover="hoveredBin = group.data"
                    @mouseout="hoveredBin = null"
                    @click="selectBin(group.data)">
                </path>
            </transition-group>
            <g class="ribbons">
                <ribbon
                    v-for="ribb in chordData.ribbons"
                    :ribbon="ribb"
                    :selectedBin="selected"
                    :hoveredBin="hoveredBin"
                    :binsMap="binsMap"
                    :rgb="rgb"
                    :d="ribbon({source: ribb.source, target: ribb.target})">
                </ribbon>
            </g>
        </g>

        <g class="labels">
            <text
                v-for="(bin, i) in connected"
                x="10"
                font-size="16"
                :y="(height / connected.length) * i">
                {{ binsMap.get(bin.id).name }}: {{ bin.percentage }}%
            </text>
        </g>

        <defs>
            <path 
                id="name-path" 
                :d="nameArc.startAngle(toRad(60)).endAngle(toRad(120))()"
                :transform="'translate(' + width / 2 + ',' + height / 2 + ')'">
            </path>
            <path 
                id="other-name-path" 
                :d="nameArc.startAngle(toRad(240)).endAngle(toRad(300))()"
                :transform="'translate(' + width / 2 + ',' + height / 2 + ')'">
            </path>
        </defs>

        <text id="name" font-size="30" v-show="!selected">
            <textPath xlink:href="#name-path">{{ name }}</textPath>
        </text>
        <text id="otherName" font-size="30" v-show="!selected">
            <textPath xlink:href="#other-name-path">{{ otherName }}</textPath>
        </text>
    </svg>
</div>
</template>

<script>
import * as d3 from 'd3'
import Ribbon from './Ribbon'

let toRad = (degree) => degree * (Math.PI / 180)
    
let chord = function(bins1, bins2, matrix) {
    // The bin sums are equal to the bin size
    let sumsBins1 = matrix.slice(0, bins1.length).map(x => d3.sum(x))
    let sumsBins2 = matrix.slice(bins1.length).map(x => d3.sum(x))
    // The total sum of the bins
    let sizeBins1 = d3.sum(sumsBins1)
    let sizeBins2 = d3.sum(sumsBins2)
    // Maps bin number + size to angle
    let scaleBins1 = d3.scaleLinear()
        .domain([0, sizeBins1])
        .range([toRad(5), toRad(175)])
    let scaleBins2 = d3.scaleLinear()
        .domain([0, sizeBins2])
        .range([toRad(185), toRad(355)])
    
    // Calculate start and end angle for each bin in the matrix (groups)
    let groups = matrix.map(function(bin, i) {
        let domainStart = i < bins1.length ? d3.sum(sumsBins1.slice(0, i)) : d3.sum(sumsBins2.slice(0, i - bins1.length))
        let domainEnd = i < bins1.length ? domainStart + sumsBins1[i] : domainStart + sumsBins2[i - bins1.length]
        let startAngle = i < bins1.length ? scaleBins1(domainStart) : scaleBins2(domainStart)
        let endAngle = i < bins1.length ? scaleBins1(domainEnd) : scaleBins2(domainEnd)
        if (endAngle - startAngle > 0.01) {
            startAngle += (0.01 / 2)
            endAngle -= (0.01 / 2)
        }
        let data = i < bins1.length ? bins1[i] : bins2[i - bins1.length]
        return { startAngle, endAngle, data, index: i }
    })
    
    // Create scales for each bin: value -> angle
    const scales = matrix.map(function(bin, i) {
        return d3.scaleLinear()
            .domain([0, d3.sum(bin)])
            .range([groups[i].startAngle, groups[i].endAngle])
    })
    
    // Calculate angles for the ribbons
    let ribbons = []
    matrix.slice(0, bins1.length).forEach(function(bin, i) {
        let sourceScale = scales[i]
        let ribs = bin.reduce(function(ribs, size, j) { 
            if (size == 0) return ribs
            
            // start and end angle of source bin
            let source = {
                startAngle: sourceScale(d3.sum(bin.slice(0, j))),
                endAngle: sourceScale(d3.sum(bin.slice(0, j+1))),
                index: i,
                data: i < bins1.length ? bins1[i] : bins2[i - bins1.length]
            }
            
            // start and end angle of target bin
            let targetBin = matrix[j]
            let targetScale = scales[j]
            let target = {
                startAngle: targetScale(d3.sum(targetBin.slice(0, i))),
                endAngle: targetScale(d3.sum(targetBin.slice(0, i+1))),
                index: j,
                data: j < bins1.length ? bins1[j] : bins2[j - bins1.length]
            }

            ribs.push({ source, target })
            return ribs
        }, [])
        ribbons.push(...ribs)
    })
    
    return {groups, ribbons}
}

export default {
    data() {
        return {
            width: 100,
            height: 100,
            nameArc: d3.arc().innerRadius(0).outerRadius(0),
            arc: d3.arc().innerRadius(0).outerRadius(0),
            ribbon: d3.ribbon().radius(0),
            hoveredBin: null,
            chordData: {groups: [], ribbons: []}
        }
    },

    components: {
        Ribbon
    },
    
    props: [
        'plotData', 
        'name', 
        'otherName', 
        'bins', 
        'otherBins', 
        'selected',
        'connected',
        'binsMap'
    ],
    
    methods: {
        updatePlot() {
            this.width = parseInt(d3.select(this.$el).style('width'), 10)
            this.height = this.width * .9

            const outerRadius = Math.min(this.width, this.height) * 0.5 - 40
            const outerRadiusLg = outerRadius * 1.01
            const outerRadiusSm = outerRadius * .98
            const innerRadius = outerRadius - 30
            const innerRadiusLg = innerRadius * .99
            const innerRadiusSm = innerRadius * 1.02
            
            this.arc.innerRadius(innerRadius).outerRadius(outerRadius)
            this.ribbon.radius(innerRadius - 5)
            this.nameArc.innerRadius(outerRadiusLg).outerRadius(outerRadiusLg + 10)
            this.chordData = chord(this.plotData.bins1, this.plotData.bins2, this.plotData.matrix)
        },
        selectBin(binId) {
            const selected = this.selected && this.selected.id === binId ? null : binId
            this.$emit('binSelected', selected ? this.binsMap.get(binId) : null)
        },
        toRad,
        rgb: d3.rgb
    },
    
    computed: {
        gTransform() {
            const x = this.selected ? this.width * .75 : this.width * .5
            return 'translate(' + x + ',' + this.height / 2 + ')'
        }
    },

    watch: {
        plotData() {
            this.updatePlot()
        }
    },
    
    mounted() {
        this.width = parseInt(d3.select(this.$el).style('width'), 10)
        this.height = this.width * .9
        this.updatePlot()
    }
}
</script>

<style>
.ribbons {
  fill-opacity: 0.67;
}

.groups > path {
    cursor: pointer;
}

.labels > text:hover {
    cursor: pointer;
    text-decoration: underline;
}

.flip-move {
  transition: transform .2s;
}
</style>
