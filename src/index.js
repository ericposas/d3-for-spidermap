import * as d3 from 'd3'
import random from 'random'
import axios from 'axios'
import _ from 'lodash'
import './airports-domestic.json'
import './airports-foreign.json'
import './airports-domestic-and-foreign.json'
import './index.scss'

let svgArea = {w:1200, h:800}
let svgMargin = svgArea.w/5
document.getElementById('root').innerHTML += `
  <svg id='svg-container' width=${svgArea.w} height=${svgArea.h} style='background-color:#ccc'></svg>
`
let svg = document.getElementById('svg-container')
let size = 4 // location circle/dot size
let origins = []
let originsToDestinations = {} // destinations will be arrays inside the originsToDestinations object
// apply linearScales to our data to ensure that it fits our graph model
// will be useful to create a UI slider that can adjust the range and domain dynamically
let linearScaleX, linearScaleY
let drawnLocations = []
// let xDomainMin = [-115, -75], xDomainExpanded = [-180, -20]
// let yDomainMin = [50, 0], yDomainExpanded = [150, 0]
// let xDomain = xDomainMin, yDomain = yDomainMin
let allLongs = [], allLats = []

const calcMinMaxLongs = arr => {
  allLongs = allLongs.concat(arr)
  allLongs = arr.sort((a, b) => a - b)
  linearScaleX = d3.scaleLinear()
                             .domain([allLongs[0], allLongs[allLongs.length-1]])
                             .range([svgMargin, svgArea.w - svgMargin])
}

const calcMinMaxLats = arr => {
  allLats = allLats.concat(arr)
  allLats = arr.sort((a, b) => b - a)
  linearScaleY = d3.scaleLinear()
                             .domain([allLats[0], allLats[allLats.length-1]])
                             .range([svgMargin, svgArea.h - svgMargin])
}

const getDataAndSetup = async () => {
  try {
    let data = await axios.get('./json/airports-domestic.json')
    origins = _.shuffle(data.data).slice(0, 3) // assign 5 random origins
    // set random set of destinations per origin
    origins.forEach(d => {
      let randomDestinations = _.shuffle(data.data).slice(1, random.int(2, 4))
      // filter randomDestinations to not include the origin point
      randomDestinations = randomDestinations.filter((rand, i) => randomDestinations.indexOf(d) != i)
      originsToDestinations[d.code] = randomDestinations
      // if () {xDomain = xDomainExpanded} else {xDomain = xDomainMin}
    })
    console.log(originsToDestinations)
    // linearScaleX = d3.scaleLinear()
    //                            .domain(xDomain)
    //                            .range([svgMargin, (svgArea.w) - svgMargin])
    // linearScaleY = d3.scaleLinear()
    //                            .domain(yDomain)
    //                            .range([svgMargin, (svgArea.h) - svgMargin])
  } catch (e) { console.log(e) }
}

const calculateRange = () => {
  let longsArr = [], latsArr = []
  Object.keys(originsToDestinations).forEach((origin, o) => {
    let _x = originsToDestinations[origin].map(d => d.longitude)
    let _y = originsToDestinations[origin].map(d => d.latitude)
    _x = _x.concat(origins[o].longitude)
    _y = _y.concat(origins[o].latitude)
    longsArr = longsArr.concat(_x)
    latsArr = latsArr.concat(_y)
  })
  calcMinMaxLongs(longsArr)
  calcMinMaxLats(latsArr)
}

const skiMap = async () => {
  await getDataAndSetup()
  calculateRange()
  Object.keys(originsToDestinations).forEach((origin, o) => {
    // draw origin in different style so we can line to and from them later
    let oX = linearScaleX(origins[o].longitude)
    let oY = linearScaleY(origins[o].latitude)
    // let tX = oX - (size*2)
    // let tY = oY - (size*3.5)
    svg.innerHTML += `
      <g>
        <circle cx=${oX} cy=${oY} r=12 fill='none' stroke='red'></circle>
        <circle cx=${oX} cy=${oY} r=4 fill='red' stroke='black'></circle>
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
    let olongs = originsToDestinations[origin].map(d => linearScaleX(d.longitude))
    let olats = originsToDestinations[origin].map(d => linearScaleY(d.latitude))
    // console.log(originsToDestinations[origin][i])
    // plot each destination for each origin location
    let curveAmt = .35
    olats.forEach((l, i) => {
      let dx1 = oX > olongs[i] ? oX + (olongs[i] * curveAmt) : oX - (olongs[i] * curveAmt)
      let dy1 = oY > olats[i] ? oY - (olats[i] * curveAmt) : oY + (olats[i] * curveAmt)
      // oX and oY are normalized values bc of the linearScale() func
      let dx2 = oX > olongs[i] ? olongs[i] + (olongs[i] * curveAmt) : olongs[i] - (olongs[i] * curveAmt)
      let dy2 = oY > olats[i] ? olats[i] - (olats[i] * curveAmt) : olats[i] + (olats[i] * curveAmt)
      // let dy2 = oY > 0 ? oY + bezCurveAmt : oY - bezCurveAmt
      // ${oX/olongs[i]},${oY/olats[i]}
      // console.log(_.includes(drawnLocations, originsToDestinations[origin][i].code))
      svg.innerHTML += `
        <path
          d="M ${oX},${oY}
             C ${dx1},${dy1} ${dx2},${dy2} ${olongs[i]},${olats[i]}" fill='none' stroke='#000'></path>`
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
      // console.log(drawnLocations)
    })
  })
}

skiMap()
