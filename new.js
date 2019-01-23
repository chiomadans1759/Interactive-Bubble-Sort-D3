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

    var radiusScale = d3.scaleSqrt().domain([20, 250]).range([10, 60])

    var forceX = d3.forceX(function (d) { 
        return width / 2
    }).strength(0.07)

    var forceCollide = d3.forceCollide(function (d) {
        return radiusScale(d.articles.score) + 2
    })

    var simulation = d3.forceSimulation()
        .force("x", forceX)
        .force("y", d3.forceY(height/2).strength(0.05))
        .force("collide", forceCollide)

    d3.queue()
        .defer(d3.json, "sales.json")
        .await(ready)
    

    function ready(error, datapoints) {
        let quotesArray = [];

        datapoints.forEach(data => {
            data.quotes.quote_list.forEach(quote => {
                quotesArray.push(quote)
            })
        })

        let sortedQuotes = quotesArray.sort((q1, q2) => {
          let q1Views = parseInt(q1.views);
          let q2Views = parseInt(q2.views);
          if(q1Views < q2Views) return 1;
          if(q1Views == q2Views) return 0;
          if(q1Views > q2Views) return -1;
        })
 
        let panelBody = d3.select(".panel-body")
        let panelHead = d3.select(".panel-head")
        let articleList = panelBody.select('.article-list')
        let entitiesList = d3.select('.entities-list-image').selectAll("li")
        let entitiesListName = d3.select('.entities-list-name').selectAll("h6")
        let tabTwo = panelBody.select('.tab-two')
        let tabOne = panelBody.select('.tab-one')

        let entityImg = tabTwo.select('#pic-section').select('img')
        let entityName = tabTwo.select('#pic-section').select('h4')
        let entityTittle = tabTwo.select('#bio-section')
            .select('h3')  
            .text("QUICK BIO")
        let entityAge = tabTwo.select('#bio-section').select('p:nth-of-type(1)')
        let entityCountry = tabTwo.select('#bio-section').select('p:nth-of-type(2)')  
        let entityWorth = tabTwo.select('#bio-section').select('p:nth-of-type(3)')
        let entityTotalQuotes = tabTwo.select('#bio-section').select('p:nth-of-type(4)')
        let entityBio = tabTwo.select('#bio-section').select('p:nth-of-type(5)') 

     
        //Return the most trending comments
        articleList.selectAll("li")
          .data(sortedQuotes.slice(0, 7))
          .enter()
          .append("li")
          .text(quote => {
            return quote.quote
          })
          
        //Add Entities images in the key entities
        entitiesList
          .data(datapoints)
          .enter()
          .append("img")
          .attr('src', function (d) {
            return d.image_path;
          }) 
    
        entitiesListName
          .data(datapoints)
          .enter()
          .append("h6")
          .text(function (d) {
            return d.name;
          }) 
        

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
            .classed("artist", true)
            .attr("stroke", "brown")
            .attr("r", function (d) {
                return radiusScale(d.articles.score)
            })
            .attr("fill", function (d) {
                return "url(#" + d.name.toLowerCase().replace(/ /g, "-") + ")"
            })  
            .on("mouseover", function () {
                tooltip.style("display", null) 
                    // d3.select(this)
                    //   .transition()
                    //   .duration(500) 
                    //   .attr('r', 60) 
                    //   .attr("stroke-width", 5) 

                    if (this !== d3.select('circle:last-child').node()) {
                        this.parentElement.appendChild(this);
                        d3.select(this)
                          .transition()
                          .duration(500) 
                          .attr('r', 70)
                          .attr("stroke-width", 5) 
                      } 
                  
            })
            
            .on("mouseout", function () {
                tooltip.style("display", "none")
                d3.select(this)
                    .transition()
                    .duration(2000)
                    .attr('r', function(d){
                        return radiusScale(d.articles.score)
                    }) 
                    .attr("stroke-width", 1)
            })
            .on("mousemove", function (d) {
                tooltip.html(
                    '<b>' +  d.name + "</b>" + 
                    "<br/>" +"<p>" + "Viewed by " + d.quotes.total + " people" + "</p>"
                     + "<p>" + "Commented by " + d.age + " people" + "</p>")	     
                .style("top", d3.event.pageY + 20 + "px")
                .style("left", d3.event.pageX + 50 + "px")
                .style("opacity", 1);
            })
            .on("mousedown", function(selectedEntity) {
                tabOne.style('display', 'none')
                tabTwo.style('display', 'flex')
                let Info = panelHead.select("#info").style("background-color", "grey").style("color", "white")
                let Article = panelHead.select("#articles").style("background-color", "inherit").style("color", "black")
                entityImg.attr('src', selectedEntity.image_path)
                entityName.text(selectedEntity.name)
                entityAge.text("Age" +" " + ":" + " " + selectedEntity.age)
                entityCountry.text("Country" +" " + ":" + " " + selectedEntity.country)
                entityWorth.text("Est. Net Worth" + " " + ":" + " $" + selectedEntity.net_worth + "M")
                entityTotalQuotes.text("Total Quotes" +" " + ":" + " " + selectedEntity.quotes.total)
                entityBio.text(selectedEntity.bio) 

                if (this == d3.select('circle:last-child').node()) {
                    this.parentElement.appendChild(this);
                    d3.select(this)
                      .transition()
                      .duration(500) 
                      .attr('r', 100)
                  } 
            }); 

            //apend a div on hover of each bubble
            var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
    
            tooltip.append("text")
                .attr("x", 15)
                .attr("dy", "1.6em")
                .style("font-size", "30px")
                .attr("font-weight", "bold") 
      
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