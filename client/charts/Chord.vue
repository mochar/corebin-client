<template>
<svg :width="width" :height="height">
    <g :transform="`translate(${width/2},${height/2})`">
        <g class="groups"></g>
        <g class="ribbons"></g>
    </g>

    <!--<g fill="none" pointer-events="none">
        <rect x="0" y="0" :height="height" :width="width/2" 
            @mouseover="sideHovered(otherBinSet.id)"
            @mouseout="sideHovered(null)">
        </rect>
        <rect :x="width/2" y="0" :height="height" :width="width/2" 
            @mouseover="sideHovered(binSet.id)"
            @mouseout="sideHovered(null)">
        </rect>
    </g>-->

    <g :transform="`translate(${width/3},${height/3})`" id="info"  v-if="activeBin">
        <text  x="10" y="30" id="info-title">Bin: {{ activeBin.name }} ({{ activeSet.name }})</text>
        <g :transform="`translate(10,${height/10})`">
            <text class="info-head">Size</text>
            <text y="20">-# contigs</text>
            <text y="20" x="150">: {{ activeBin.size }}</text>
            <text y="40">-# bp</text>
            <text y="40" x="150">: {{ activeBin.mbp.toFixed(3) }} Mb</text>
        </g>
        <g :transform="`translate(10,${height/5})`" v-if="$store.state.assembly.genesSearched">
            <text class="info-head">Completeness</text>
            <text y="20">- contamination</text>
            <text y="20" x="150">: {{ activeBin.contamination.toFixed(3) }}%</text>
            <text y="40">- completeness</text>
            <text y="40" x="150">: {{ activeBin.completeness.toFixed(3) }}%</text>
        </g>
        <transition name="fade" mode="out-in">
            <g id="transition-g" v-if="showChordActions">
                <g :transform="`translate(10,${height/3.25})`">
                    <text class="info-head">Refine</text>
                    <text y="20" class="info-link" @click="$emit('refine')">
                        - Open refinement plot
                    </text>
                </g>
            </g>
        </transition>
    </g>

    <defs>
        <path 
            id="name-path" 
            :transform="'translate(' + width / 2 + ',' + height / 2 + ')'">
        </path>
        <path 
            id="other-name-path" 
            :transform="'translate(' + width / 2 + ',' + height / 2 + ')'">
        </path>
        <filter x="0" y="0" width="1" height="1" id="solid">
            <feFlood flood-color="black" flood-opacity=".2" />
            <feComposite in="SourceGraphic"/>
        </filter>
    </defs>

    <g>
        <text id="name" font-size="30">
            <textPath xlink:href="#name-path"></textPath>
        </text>
        <text id="otherName" font-size="30">
            <textPath xlink:href="#other-name-path"></textPath>
        </text>
    </g>
</svg>
</template>

<script>
import * as d3 from 'd3'

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
        let side = i < bins1.length ? 'right' : 'left'
        return { startAngle, endAngle, data, index: i, side, _endAngle: endAngle }
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
            svg: null,
            nameArc: d3.arc().innerRadius(0).outerRadius(0),
            arc: d3.arc().innerRadius(0).outerRadius(0),
            ribbon: d3.ribbon(),
            hoveredBin: null,
            chordData: {groups: [], ribbons: []},
            labelScale: d3.scaleBand(),
            outerRadius: null,
            innerRadius: null,
            hoverBinSet: null
        }
    },
    
    props: [
        'plotData', 
        'bins', 
        'otherBins', 
        'selected',
        'selectedBinSet',
        'unselectedBinSet',
        'connected',
        'binsMap',
        'binSet',
        'otherBinSet'
    ],
    
    methods: {
        updatePlot() {
            console.log('chord update')
            this.resize()
            
            this.outerRadius = Math.min(this.width, this.height) * 0.5 - 40
            const outerRadiusLg = this.outerRadius * 1.01
            const outerRadiusSm = this.outerRadius * .98
            this.innerRadius = this.outerRadius - 10
            const innerRadiusLg = this.innerRadius * .99
            const innerRadiusSm = this.innerRadius * 1.02
            
            this.arc.innerRadius(this.innerRadius).outerRadius(this.outerRadius)
            this.nameArc.innerRadius(outerRadiusLg).outerRadius(outerRadiusLg + 10)
            this.chordData = chord(this.plotData.bins1, this.plotData.bins2, this.plotData.matrix)


            this.updateGroups()
            this.updateRibbons()
            this.svg.select('#name > textPath').text(this.binSet && this.binSet.name)
            this.svg.select('#otherName > textPath').text(this.otherBinSet && this.otherBinSet.name)
            this.svg.select('#name-path').attr('d', this.nameArc({startAngle: toRad(60), endAngle: toRad(120)}))
            this.svg.select('#other-name-path').attr('d', this.nameArc({startAngle: toRad(240), endAngle: toRad(300)}))
        },
        updateRibbons() {
            const ribbon = this.svg.select('g.ribbons').selectAll('.ribbon')
                .data(this.chordData.ribbons, ribbon => `${ribbon.source.data}_${ribbon.target.data}`)
            ribbon.transition()
                .attrTween('d', this.arcTweenRibbon())
                .on('end', function(g) {
                    this.__pdata__ = {
                        source: {startAngle: g.source.startAngle, endAngle: g.source.endAngle},
                        target: {startAngle: g.target.startAngle, endAngle: g.target.endAngle}
                    }
                })
            ribbon.exit().remove()
            ribbon.enter().append('path')
                .classed('ribbon', true)
                .attr('d', this.generateRibbon)
                .style('fill', ribbon => {
                    const bin = this.activeBin && this.activeBin.id
                    let color = '#bbb'
                    if (ribbon.target.data === bin) {
                        color = this.binsMap.get(ribbon.source.data).color
                    } else if(ribbon.source.data === bin) {
                        color = this.binsMap.get(ribbon.target.data).color
                    } 
                    return color
                })
                .style('stroke', function() { 
                    return d3.rgb(d3.select(this).style('fill')).darker()
                })
                .each(function(g) {
                    this.__pdata__ = {
                        source: {startAngle: g.source.startAngle, endAngle: g.source.endAngle},
                        target: {startAngle: g.target.startAngle, endAngle: g.target.endAngle}
                    }
                })
        },
        updateGroups() {
            const group = this.svg.select('g.groups').selectAll('.group')
                // .data(this.chordData.groups, group => `${group.index}-${group.data}`)
                .data(this.chordData.groups, group => `${group.side}-${group.data}`)
            group.transition()
                .attrTween('d', this.arcTween())
                .on('end', function(g) {
                    this.__pdata__ = {startAngle: g.startAngle, endAngle: g.endAngle}
                })
            group.exit().remove()
            group.enter().append('path')
                .classed('group', true)
                .attr('stroke', '#000000')
                .on('click', group => this.selectBin(group.data))
                .on('mouseover', group => this.hoveredBin = this.binsMap.get(group.data))
                .on('mouseout', () => this.hoveredBin = null)
                .attr('fill', group => this.binsMap.get(group.data).color)
                .attr('d', this.arc)
                .each(function(g) {
                    this.__pdata__ = {startAngle: g.startAngle, endAngle: g.endAngle}
                })
        },
        resize() {
            if (this.$route.path === '/compare') {
                this.height = $(this.$el).parent().height()
                this.width = $(this.$el).parent().width()
            }
        },
        selectBin(binId) {
            const selected = this.selected && this.selected.id === binId ? null : binId
            this.$emit('binSelected', selected ? this.binsMap.get(binId) : null)
        },
        generateRibbon(ribbon) {
            ribbon.source.radius = ribbon.target.radius = this.innerRadius - 5
            if (this.binsMap.get(ribbon.source.data).binSetId == this.hoverBinSet)
                ribbon.target.radius = this.innerRadius - 15
            else if (this.binsMap.get(ribbon.target.data).binSetId == this.hoverBinSet)
                ribbon.source.radius = this.innerRadius - 15
            return this.ribbon(ribbon)
        },
        sideHovered(binSetId) {
            this.hoverBinSet = binSetId
            this.svg.selectAll('.ribbon')
                .transition()
                .duration(100)
                .ease(d3.easeLinear)
                .attr('d', this.generateRibbon)
        },
        arcTween() {
            const arc = this.arc
            return function(group) {
                const interpolate = d3.interpolate(this.__pdata__, group)
                return t => {
                    const new_ = interpolate(t)
                    group.startAngle = new_.startAngle
                    group.endAngle = new_.endAngle
                    return arc(group)
                }
            }
        },
        arcTweenRibbon() {
            const generateRibbon = this.generateRibbon
            return function(ribbon) {
                const interpolate = d3.interpolate(this.__pdata__, ribbon)
                return t => {
                    const new_ = interpolate(t)
                    ribbon.source.startAngle = new_.source.startAngle
                    ribbon.source.endAngle = new_.source.endAngle
                    ribbon.target.startAngle = new_.target.startAngle
                    ribbon.target.endAngle = new_.target.endAngle
                    return generateRibbon(ribbon)
                }
            }
        },
        toRad   ,
        rgb: d3.rgb
    },
    
    computed: {
        leftSelected() {
            // True if the selected bin belongs to the left bin set. Otherwise false.
            // This also means that the value is false when there is no bin selected.
            return this.selected && this.plotData.bins1.indexOf(this.selected.id) > -1
        },
        activeBin() {
            return this.hoveredBin || this.selected
        },
        activeSet() {
            if (!this.activeBin) return null
            return this.binSet.id == this.activeBin.binSetId ? this.binSet : this.otherBinSet
        },
        showChordActions() {
            return this.selected && (!this.hoveredBin || this.hoveredBin.id == this.selected.id)
        }
    },

    watch: {
        connected() {
            // const connectedIds = this.connected.map(b => b.id)
            // this.svg.select('g.groups').selectAll('.group')
            //     .filter(group => connectedIds.includes(group.data))
            //     .transition()
            //     .duration(1000)
            //     .attrTween('d', g => this.arcTween(g, g.endAngle + .2))
        },
        '$route': 'updatePlot',
        'plotData': 'updatePlot',
        'hoveredBin': 'updateRibbons',
        'hoveredBin': console.log
    },
    
    mounted() {
        this.svg = d3.select(this.$el)
        this.resize()
        $(window).resize(this.updatePlot)
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

#info {
    font-size: 1.2rem;
}

#info > text, #info g:not(#transition-g) {
    fill: white;
    text-shadow: 1px 1px 8px black;
    /*filter: url(#solid);*/
}

#info {
    filter: url(#solid);
}

#info-title {
    font-size: larger;
    text-decoration: underline;
    font-weight: bold;
}

.info-head {
    font-size: 1.2rem;
    font-weight: bold;
}

.info-link {
    text-decoration: underline;
    cursor: pointer;
}
.info-link:hover {
    text-shadow: 0px 0px 8px black !important;
}
</style>

<style scoped>
svg {
    display: block;
}
</style>