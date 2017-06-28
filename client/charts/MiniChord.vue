<template>
<svg :width="width" :height="height">
    <g :transform="`translate(${width/2},${height/2})`">
        <g class="groups"></g>
        <g class="ribbons"></g>
    </g>
</svg>  
</template>

<script>
export default {
    data() {
        return {
            height: 100,
            width: 100
        }
    },

    mounted() {
        const svg = d3.select(this.$el)
        this.width = $(this.$el).parent().width() / 2
        this.height = this.width 
        const outerRadius = this.height * 0.7 - 35
        const innerRadius = outerRadius - 4
        const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)
        const ribbon = d3.ribbon().radius(innerRadius-2)

        const matrix = [
            [0,  0, 0, 0,   5,   0, 0, 0],

            [0,  0, 0, 0,   0,   0, 0, 30],
            [0,  0, 0, 0,   0,   0, 30, 0],
            [0,  0, 0, 0,   0,   30, 0, 0],

            [5,  0, 0, 0,   0,   0, 0, 0],

            [0,  0, 0, 30,  0,   0, 0, 0],
            [0,  0, 30, 0,  0,   0, 0, 0],
            [0,  30, 0, 0,  0,   0, 0, 0]
        ]
        const chord = d3.chord().padAngle(0.05)

        const g = svg.select('g').datum(chord(matrix))
        g.select('g.groups').selectAll('path')
            .data(chords => chords.groups)
            .enter().append('path')
            .filter(d => d.index !== 0 && d.index !== 4)
            .attr('d', arc)
        
        g.select('g.ribbons').selectAll('path')
            .data(chords => chords)
            .enter().append('path')
            .filter(d => ![0,4].includes(d.source.index))
            .attr('d', ribbon)
    }
}
</script>

<style scoped>
.groups {
    fill: #555;
    stroke: #444;
}

.ribbons {
    fill: #bbb;
    stroke: #bbb;
}

svg {
    transform: rotate(-5deg);
}
</style>
