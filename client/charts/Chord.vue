<template>
<svg :width="width" :height="height">
    <g :transform="`translate(${width/2},${height/2})`">
        <g class="groups"></g>
        <g class="ribbons"></g>
        <g class="distributions"></g>
        <line id="arrow" marker-end="url(#arrowhead)" v-show="activeBin"></line>
    </g>

    <g id="info"  v-if="activeBin">
        <text :transform="`translate(${width/2},${height/2})`" id="info-title">{{ activeBin.name }} ({{ activeSet.name }})</text>
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
            <feFlood flood-color="black" flood-opacity=".4" />
            <feComposite in="SourceGraphic"/>
        </filter>
        <marker id="arrowhead" viewBox="-0 -5 10 10" refX="5" refY="0"
            markerWidth="4" markerHeight="4" orient="auto">
            <path d="M0,-5L10,0L0,5" fill="black" stroke="none"></path>
        </marker>
    </defs>

    <g v-show="!activeBin && false">
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
        return { startAngle, endAngle, data, index: i, side }
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

    // Distributions
    let distributions = matrix.map((bin, i) => {
        let data = i < bins1.length ? bins1[i] : bins2[i - bins1.length]
        let side = i < bins1.length ? 'right' : 'left'
        let angleScale = d3.scaleLinear()
            .domain([0, d3.sum(bin)])
            .range([groups[i].startAngle, groups[i].endAngle])
        const distribution = bin.reduce((d, size, j) => {
            if (size > 0)
                d.distribution.push({
                    bin: j < bins1.length ? bins1[j] : bins2[j - bins1.length],
                    size,
                    startAngle: angleScale(d.sum),
                    endAngle: angleScale(d.sum += size)
                })
            return d
        }, {distribution: [], sum: 0}).distribution
        return { data, side, distribution }
    })
    
    return {groups, ribbons, distributions}
}

export default {
    data() {
        return {
            width: 100,
            height: 100,
            svg: null,
            nameArc: d3.arc().innerRadius(0).outerRadius(0),
            distArc: d3.arc().innerRadius(0).outerRadius(0),
            arc: d3.arc().innerRadius(0).outerRadius(0),
            ribbon: d3.ribbon(),
            chordData: {groups: [], ribbons: []},
            labelScale: d3.scaleBand(),
            outerRadius: null,
            innerRadius: null,
            hoverBinSet: null
        }
    },
    
    props: [
        'plotData', 
        'selected',
        'selectedBinSet',
        'unselectedBinSet',
        'binsMap',
        'binSet',
        'otherBinSet',
        'hoveredBin'
    ],
    
    methods: {
        updatePlot() {
            this.resize()

            if (!this.plotData) return
            
            this.outerRadius = Math.min(this.width, this.height) * 0.5 - 40
            const outerRadiusLg = this.outerRadius * 1.01
            this.innerRadius = this.outerRadius - 10
            
            this.arc.innerRadius(this.innerRadius).outerRadius(this.outerRadius)
            this.distArc.innerRadius(this.innerRadius - 10).outerRadius(this.outerRadius - 15)
            this.nameArc.innerRadius(outerRadiusLg).outerRadius(outerRadiusLg + 10)
            this.chordData = chord(this.plotData.bins1, this.plotData.bins2, this.plotData.matrix)

            this.updateGroups()
            this.updateDistributions()
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
                .each(function(g) {
                    this.__pdata__ = {
                        source: {startAngle: g.source.startAngle, endAngle: g.source.endAngle},
                        target: {startAngle: g.target.startAngle, endAngle: g.target.endAngle}
                    }
                })
              .merge(ribbon)
                .style('fill', ribbon => {
                    const bin = this.activeBin && this.activeBin.id
                    let color = '#cfcfcf'
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
        },
        updateGroups() {
            const group = this.svg.select('g.groups').selectAll('.group')
                .data(this.chordData.groups, group => `${group.side}-${group.data}`)
            group.select('path').transition()
                .attrTween('d', this.arcTween(this.arc))
                .on('end', function(g) {
                    this.__pdata__ = {startAngle: g.startAngle, endAngle: g.endAngle}
                })
            group.exit().remove()
            const groupEnter = group.enter().append('g').classed('group', true)
            groupEnter.append('path')
                .attr('stroke', '#000000')
                .attr('stroke-width', 1.5)
                .attr('id', d => `arc-${d.side}-${d.data}`)
                .on('click', group => this.selectBin(group.data))
                .on('mouseover', group => this.hoverBin(group.data))
                .on('mouseout', () => this.hoverBin(null))
                .attr('fill', group => this.binsMap.get(group.data).color)
                .attr('d', this.arc)
                .each(function(g) {
                    this.__pdata__ = {startAngle: g.startAngle, endAngle: g.endAngle}
                })
            groupEnter.append('text')
                .attr('dx', 5)
                .attr('dy', -5)
              .append('textPath')
                .attr('xlink:href', d => `#arc-${d.side}-${d.data}`)
            groupEnter.merge(group)
              .select('text').select('textPath')
                .text(d => d.endAngle - d.startAngle < toRad(5) ? '' : this.binsMap.get(d.data).name)
        },
        updateDistributions() {
            const dist = this.svg.select('g.distributions').selectAll('.distribution')
                .data(this.chordData.distributions, dist => `${dist.side}-${dist.data}`)
            dist.exit().remove()
            const distEnter = dist.enter().append('g').classed('distribution', true)
            const path = distEnter.merge(dist).selectAll('path').data(d => d.distribution)
            path.exit().remove()
            const pathEnter = path.enter().append('path')
                .attr('stroke', '#000000')
                .attr('fill', dist => this.binsMap.get(dist.bin).color)
                .attr('d', this.distArc)
                .each(function(g) {
                    this.__pdata__ = {startAngle: g.startAngle, endAngle: g.endAngle}
                })
              .merge(path).transition()
                .attrTween('d', this.arcTween(this.distArc))
                .on('end', function(g) {
                    this.__pdata__ = {startAngle: g.startAngle, endAngle: g.endAngle}
                })
        },
        resize() {
            if (this.$route.path === '/compare') {
                this.height = $('.app-right').height()
                this.width = $('.app-right').width()
            }
        },
        selectBin(binId) {
            const selected = this.selected && this.selected.id === binId ? null : binId
            this.$emit('binSelected', selected ? this.binsMap.get(binId) : null)
        },
        hoverBin(binId) {
            const hovered = this.hoveredBin && this.hoveredBin.id === binId ? null : binId
            this.$emit('binHovered', hovered ? this.binsMap.get(binId) : null)
        },
        generateRibbon(ribbon) {
            ribbon.source.radius = ribbon.target.radius = this.innerRadius - 15
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
        arcTween(arc) {
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
        arrowTween() {
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
        }
    },

    watch: {
        '$route': 'updatePlot',
        'plotData': 'updatePlot',
        'hoveredBin': 'updateRibbons',
        activeBin() {
            if (!this.activeBin) return
            const group = this.chordData.groups.filter(d => d.data === this.activeBin.id)[0]
            const arc = d3.arc().innerRadius(this.outerRadius + 20).outerRadius(this.outerRadius + 60)
            const coord1 = arc.centroid(group)
            arc.innerRadius(this.outerRadius + 20).outerRadius(this.outerRadius + 30)
            const coord2 = arc.centroid(group)
            this.svg.select('line#arrow')
                .attr('fill', 'red')
                .attr('x1', coord1[0])
                .attr('y1', coord1[1])
                .attr('x2', coord2[0])
                .attr('y2', coord2[1])
        }
    },
    
    mounted() {
        this.svg = d3.select(this.$el)
        this.resize()
        $(window).resize(this.updatePlot)
    }
}
</script>

<style>
#arrow {
    stroke-width: 3;
    stroke: black;
}
.ribbons {
  fill-opacity: 0.67;
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
    text-anchor: middle;
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

.groups {
    cursor: pointer;
}
</style>