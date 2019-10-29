import * as d3 from 'd3'
import random from 'random'
import axios from 'axios'
import _ from 'lodash'
import './airports.json'
import './index.scss'

// let svgSize = innerWidth * .65
let w = innerWidth * .75, h = w
let originLowerLimitX = (w * .2), originUpperLimitX = (w * .5)
let originLowerLimitY = (w * .05), originUpperLimitY = (w * .2)

let destLowerLimit = (w * .2), destUpperLimit = w - (w * .2)
document.getElementById('root').innerHTML += `
  <svg id='svg-container' width=${w} height=${h} style='background-color:#ccc'></svg>
`

let origins
let destinations = {}
let size = 4
const getJSON = async () => {
  try {
    let data = await axios.get('./json/airports.json')
    let randomize = _.shuffle(data.data)
    origins = randomize.slice(0, 5)
    // set random set of destinations per origin
    origins.forEach(o => {
      destinations[o.code ? o.code : o.four_digit_code] = randomize.slice(0, random.int(10, 20))
    })
    console.log(origins)
    console.log(destinations)
    run()
  } catch (e) { console.log(e) }
}

const run = () => {
  let svg = document.getElementById('svg-container')
  let _x = origins.map(d => d.latitude)
  let _y = origins.map(d => d.longitude)
  // sort values to figure out the greatest among them
  let _xSorted = _x.sort((a,b) => a - b)
  let _ySorted = _y.sort((a,b) => a - b)
  // apply linearScales to our data to ensure that it fits our graph model
  let originScaleX = d3.scaleLinear()
                             .domain([_xSorted[0], _xSorted[_xSorted.length-1]])
                             .range([originLowerLimitX, originUpperLimitX])
  let originScaleY = d3.scaleLinear()
                             .domain([_ySorted[0], _ySorted[_ySorted.length-1]])
                             .range([originLowerLimitY, originUpperLimitY])

  // let olat = originScaleX(d.latitude)
  // let olong = originScaleY(d.longitude)
  let olats = origins.map(d => originScaleX(d.latitude))
  let olongs = origins.map(d => originScaleY(d.longitude))
  origins.forEach((d,i) => {
    svg.innerHTML += `
      <!--
      <g>
        <circle cx=${w/2} cy=${w/2} r=${(w-4)/2} stroke='#000' fill='none'></circle>
      </g>
      -->
      <g>
        <rect x=${olats[i]} y=${olongs[i]} width=${size} height=${size} fill='#000'></rect>
        <text x=${olats[i] - size} y=${olongs[i] - size} font-family='arial' font-size='0.5rem' fill='#000'>
          ${d.code ? d.code : d.four_digit_code}
        </text>
        <!--
        <text x=${olats[i]} y=${olongs[i] - (size*.5)} font-family='arial' font-size='0.5rem' fill='#000'>
          lat: ${parseFloat(d.latitude).toFixed(2)}, &nbsp; long:${parseFloat(d.longitude).toFixed(2)}
        </text>
        -->
      </g>
    `
  })


}

getJSON()
