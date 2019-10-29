import './images/flame.png'
import './index.scss'
import * as d3 from 'd3'

document.getElementById('root').innerHTML += `
<svg class='container' width=${innerWidth} height=${innerHeight}></svg>
`
let svg = d3.select('svg')
let data = [80, 120, 60, 150, 200, 473298, 743, 728, 32, 8904, 89, 273, 122]
let barHt = 20
let arcData = [
  {x:32,y:89},
  {x:432,y:543},
  {x:565,y:423},
  {x:46,y:345},
  {x:4225,y:654},
  {x:64,y:534},
  {x:32,y:87},
  {x:98,y:87},
  {x:32,y:85546},
  {x:3664,y:576},
  {x:320,y:767},
  {x:4564,y:765}
]

// let bar = d3.select('svg').selectAll('rect')
svg.append('rect')
   .attr('class', 'container')
   .attr('x', 0).attr('y', 0)
   .attr('width', innerWidth).attr('height', innerHeight)
   .attr('fill', '#999')

// console.log(svg)

let bar = d3.select('svg')
            .selectAll('.container')
            .data(data).enter()
            .append('rect')
            .attr('width', d => d)
            .attr('height', 2)
            .attr('transform', (d,i) => `translate(0, ${i * 4})`)

let curves = d3.select('svg')
               .selectAll('.container')
               .data(arcData).enter()
               .d3.linkHorizontal()
               .x(d => d.y)
               .y(d => d.x)
