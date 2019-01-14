(function () {
    var width = 800,
        height = 600;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")

    var defs = svg.append("defs");
    // defs.append("pattern")
    //     .attr("id", "jon-snow")
    //     .attr("height", "100%")
    //     .attr("width", "100%")
    //     .attr("patternContentUnits", "objectBoundingBox")
    //     .append("image")
    //     .attr("height", 1)
    //     .attr("width", 1)
    //     .attr("preserveAspectRatio", "none")
    //     .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
    //     .attr("xlink:href", "")

    var radiusScale = d3.scaleSqrt().domain([20, 250]).range([10, 60])

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
        .force("y", d3.forceY(height/2).strength(0.05))
        .force("collide", forceCollide)

    d3.queue()
        .defer(d3.json, "sales.json")
        .await(ready)

    function ready(error, datapoints) {
        defs.selectAll(".artist-pattern")
            .data(datapoints)
            .enter()
            .append("pattern")
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
            .on("mousedown", function(selectedEntity) {
                //Creates an array consisting of only keys needed from the selected entity object
                var entityAttributes = columns.map(function(col){
                    return selectedEntity[col]
                }) 

                //Remove all previous rows
                tbody.selectAll("tr").remove()

                tbody.append("tr")  //Appends a new row
                    .selectAll("td")
                    .data(entityAttributes)
                    .enter()
                    .append("td")
                    .text(function(currentAttribute){
                        return currentAttribute
                    })      
            }); 

            //apend a div on hover n each bubble
            var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
    
            tooltip.append("text")
                .attr("x", 15)
                .attr("dy", "1.6em")
                .style("font-size", "30px")
                .attr("font-weight", "bold") 


            //Append a details table on click of each bubble
            var columns = ["id","name", "sales", "decade"];
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
                    });

        
                
        
        //Bubbles split on click of "Decade Split" button
        // d3.select("#decade").on('click', function () {
        //     simulation
        //         .force("x", forceX)
        //         .alphaTarget(0.5)
        //         .restart()

        // })

        
        //Make the bubbles stay combined
        simulation
                .force("x", d3.forceX(width / 2).strength(0.05))
                .alphaTarget(0.05)
                .restart()
        
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