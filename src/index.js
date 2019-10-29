import * as d3 from 'd3'
import random from 'random'
import axios from 'axios'
import _ from 'lodash'
import './airports.json'
import './index.scss'

let svgArea = 600
let svgMargin = 100
document.getElementById('root').innerHTML += `
  <svg id='svg-container' width=${svgArea} height=${svgArea} style='background-color:#ccc'></svg>
`
let svg = document.getElementById('svg-container')
let size = 4 // location circle/dot size
let origins = []
let originsToDestinations = {} // destinations will be arrays inside the originsToDestinations object
// apply linearScales to our data to ensure that it fits our graph model
// will be useful to create a UI slider that can adjust the range and domain dynamically
let linearScaleX, linearScaleY
let drawnLocations = []
let xDomainMin = [-110, -70], xDomainExpanded = [-180, -20]
let yDomainMin = [40, 20], yDomainExpanded = [150, 0]
let xDomain = xDomainMin, yDomain = yDomainMin

const getDataAndSetup = async () => {
  try {
    let data = await axios.get('./json/airports.json')
    origins = _.shuffle(data.data).slice(0, 5) // assign 5 random origins
    // set random set of destinations per origin
    origins.forEach(d => {
      let randomDestinations = _.shuffle(data.data).slice(0, random.int(1, 6))
      originsToDestinations[d.code] = randomDestinations
      // if () {xDomain = xDomainExpanded} else {xDomain = xDomainMin}

    })
    console.log(origins, originsToDestinations)
    linearScaleX = d3.scaleLinear()
                               .domain(xDomain)
                               .range([svgMargin, svgArea - svgMargin])
    linearScaleY = d3.scaleLinear()
                               .domain(yDomain)
                               .range([svgMargin, svgArea - svgMargin])
  } catch (e) { console.log(e) }
}

const skiMap = async () => {
  await getDataAndSetup()
  Object.keys(originsToDestinations).forEach((origin, o) => {
    // draw origin in different style so we can line to and from them later
    let oX = linearScaleX(origins[o].longitude)
    let oY = linearScaleY(origins[o].latitude)
    // let tX = oX - (size*2)
    // let tY = oY - (size*3.5)
    svg.innerHTML += `
      <g>
        <circle cx=${oX} cy=${oY} r=10 fill='none' stroke='red'></circle>
      </g>
    `
    // <!-- <text x=${tX} y=${tY} font-family='arial' font-size='0.5rem' fill='red'>${origins[o].code}</text> -->
    // console.log(originsToDestinations[dest])
    let _x = originsToDestinations[origin].map(d => d.longitude)
    let _y = originsToDestinations[origin].map(d => d.latitude)
    // console.log(_y)
    // sort values to figure out the greatest among them
    let _xSorted = _x.sort((a,b) => a - b)
    let _ySorted = _y.sort((a,b) => a - b)
    let olats = originsToDestinations[origin].map(d => linearScaleY(d.latitude))
    let olongs = originsToDestinations[origin].map(d => linearScaleX(d.longitude))
    // console.log(originsToDestinations[origin][i])
    // plot each destination for each origin location
    olats.forEach((l, i) => {
      console.log(_.includes(drawnLocations, originsToDestinations[origin][i].code))
      if (!_.includes(drawnLocations, originsToDestinations[origin][i].code)) {
        drawnLocations = drawnLocations.concat(originsToDestinations[origin][i].code)
        svg.innerHTML += `
          <g>
            <circle cx=${olongs[i]} cy=${olats[i]} r=${size/2} fill='#000'></circle>
            <text x=${olongs[i] - size} y=${olats[i] - (size*5)} font-family='arial' font-size='0.5rem' fill='#000'>
              ${originsToDestinations[origin][i].code ? originsToDestinations[origin][i].code : originsToDestinations[origin][i].icao}
            </text>
            <text x=${olongs[i] - size} y=${olats[i] - (size * 3)} font-family='arial' font-size='0.5rem' fill='#000'>
              lat: ${parseFloat(originsToDestinations[origin][i].latitude).toFixed(2)}
            </text>
            <text x=${olongs[i] - size} y=${olats[i] - size} font-family='arial' font-size='0.5rem' fill='#000'>
              long:${parseFloat(originsToDestinations[origin][i].longitude).toFixed(2)}
            </text>
          </g>
        `
      }
      console.log(drawnLocations)
    })
  })
}

skiMap()
