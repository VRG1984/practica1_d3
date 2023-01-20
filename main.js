const width = 800
const height = 400
const margin = {
    top: 10,
    bottom: 70,
    right: 10,
    left: 40
}

const svg = d3.select("div#chart").append("svg").attr("width", width).attr("height", height)
const elementGroup = svg.append("g").attr("id", "elementGroup")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
const xAxisGroup = svg.append("g").attr("id", "xAxisGroup").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
const yAxisGroup = svg.append("g").attr("id", "yAxisGroup").attr("transform", `translate(${margin.left}, ${margin.top})`)

const scaleX = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.2)
const scaleY = d3.scaleLinear().range([height - margin.bottom - margin.top, 0])
const xAxis = d3.axisBottom().scale(scaleX)
const yAxis = d3.axisLeft().ticks(5).scale(scaleY)

d3.csv("WorldCup.csv").then(data => {
    console.log(data)
    data.map(d => {
        d.Year = +d.Year
    })

    let nest = d3.nest()
        .key(d => d.Winner)
        .entries(data)
    console.log(nest)

    scaleX.domain(data.map(d => d.Winner))
    scaleY.domain([0, (d3.max(nest.map(d => d.values.length)))])

    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    let barras = elementGroup.selectAll("rect").data(nest)
    barras.enter().append("rect")
        .attr("class", "barras")
        .attr("x", d => scaleX(d.key))
        .attr("height", d => height - margin.bottom - margin.top - scaleY(d.values.length))
        .attr("width", scaleX.bandwidth())
        .attr("y", d => scaleY(d.values.length))
})
