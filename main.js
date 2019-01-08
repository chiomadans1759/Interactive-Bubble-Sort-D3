// (function() {
//     var width = 500,
//         height = 500;

//     var svg = d3.select("#chart-area")
//         .append("svg")
//         .attr("height", height)
//         .attr("width", width)
//         .append("g")
//         .attr("transform", "translate(0,0)")

//         d3.queue()
//         .defer(d3.csv, "china.csv")
//         .await(ready)

//     function ready (datapoints) {
    
//         var circles = svg.selectAll(".posts")
//             .data(datapoints)
//             .enter().append("circle")
//             .attr("class", "post")
//             .attr("r", 10)
//             .attr("fill", "lightblue")
   
//     }
// })
// ;


// // var svg = d3.select("#chart-area").append("svg")
// // .attr("width", 400)
// // .attr("height", 400);

// // var circle = svg.append("circle")
// // .attr("cx", 200)
// // .attr("cy", 200)
// // .attr("r", 200)
// // .attr("fill", "blue")