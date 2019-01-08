(function () {
    var width = 800,
        height = 500;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")



    var defs = svg.append("defs");
    defs.append("pattern")
        .attr("id", "jon-snow")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
        .attr("xlink:href", "")



    var radiusScale = d3.scaleSqrt().domain([20, 350]).range([10, 80])

    var forceX = d3.forceX(function (d) {
        if (d.decade === 'pre-2000') {
            return 170
        } else {
            return 600
        }
        return width / 2
    }).strength(0.07)

    var forceCollide = d3.forceCollide(function (d) {
        return radiusScale(d.sales) + 1
    })


    var simulation = d3.forceSimulation()
        .force("x", forceX)
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", forceCollide)

    d3.queue()
        .defer(d3.json, "sales.json")
        .await(ready)

    function ready(error, datapoints) {
        defs.selectAll(".artist-pattern")
            .data(datapoints)
            .enter().append("pattern")
            .attr("class", "artist-pattern")
            .attr("id", function (d) {
                return d.name.toLowerCase().replace(/ /g, "-")
            })
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("height", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("xlink:href", function (d) {
                return d.image_path

            })

        var circles = svg.selectAll(".artist")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "artist")
            .attr("r", function (d) {
                return radiusScale(d.sales)
            })
            .attr("fill", function (d) {
                return "url(#" + d.name.toLowerCase().replace(/ /g, "-") + ")"
            })
            .attr("cx", 100)
            .attr("cy", 300)
            .style("stroke", "#74b9ff")
            .on("mouseover", function () {
                tooltip.style("display", null)
            })
            .on("mouseout", function () {
                tooltip.style("display", "none")
            })
            .on("mousemove", function (d) {
                tooltip.html("text").text(d.name + " : " + d.bio)           
                .style("top", d3.event.pageY + 20 + "px")
                .style("left", d3.event.pageX + 50 + "px")
                .style("opacity", 1);
            })
            .on("mousedown", function(d) {
                // table.html("text").text(d.name + " : " + d.bio)           
                // .style("top", d3.event.pageY + "px")
                // .style("left", d3.event.pageX  + "px")
                // .style("opacity", 1)
                // .append("tr")
                // .attr("height", "60px")
                // .attr("width", "100px")
                // .append("th") 
                // .attr("class", "th")
                // .attr("height", "100%")
                // .attr("width", "100%")
                // .style("fill", "red")
                // .append("text") ;

                // table.style("opacity", 1);

               
                var rows = tbody.selectAll("tr")
                        .data(datapoints)
                        .enter()
                        .append("tr");
                var cells = rows.selectAll("td")
                .data(function (row) {
                    return columns.map(function(column){
                        return{
                            column:column,
                            value:row[column]
                        }
                    })
                })
                .style("opacity", 1)   
            }) 

            var columns = ["id","name", "sales", "decade","bio", "image_path"];
            var table = d3.select("body")
                        .append("table")
                        .attr("class", "table")
                        .style("opacity", 1);
            var thead = table.append("thead");
            var tbody = table.append("tbody");
                    thead.append("tr")
                    .selectAll("th")
                    .data(columns)
                    .enter()
                    .append("th")
                    .style("class", "table")
                    .style("opacity", 1)
                    .text(function(d, i){
                        return d;
                    })
          

           

            var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
    
            tooltip.append("text")
                .attr("x", 15)
                .attr("dy", "1.6em")
                .style("font-size", "30px")
                .attr("font-weight", "bold")  

        d3.select("#decade").on('click', function () {
            simulation
                .force("x", forceX)
                .alphaTarget(0.5)
                .restart()

        })

        d3.select('#combine').on('click', function () {
            simulation
                .force("x", d3.forceX(width / 2.5).strength(0.05))
                .alphaTarget(0.05)
                .restart()
        })



        simulation.nodes(datapoints)
            .on('tick', ticked)

        function ticked() {
            circles
                .attr("cx", function (d) {
                    return d.x
                })
                .attr("cy", function (d) {
                    return d.y
                })
        }
    }
})();