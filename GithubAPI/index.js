//javascript
console.log("Working...");
// !!-- CODE FOR SCALABLE BARCHART --!! //

/*var dataset=[87,630,562,690,370,420,700,500];
var dataset=[1,2,3,4,3,2,1,1,10];

var svgWidth=500, svgHeight=800, barPadding=5;
var barWidth = (svgWidth/dataset.length);

var svg=d3.select('svg')
     .attr("width",svgWidth)
     .attr("height",svgHeight);

var yScale = d3.scaleLinear()			//Scales the barchart depending on the data
     .domain([0,d3.max(dataset)])
     .range([0,svgHeight]);

var barChart=svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("y",function(d) {return svgHeight-yScale(d); })
     .attr("height",function(d) {return yScale(d); })
     .attr("width",barWidth-barPadding)
     .attr("transform",function (d,i) {var translate = [barWidth * i,0];
                                       return "translate("+ translate +")";
                                       })
     .attr("fill","darkblue");

var text=svg.selectAll("text")		//returns empty as no text element in svg
     .data(dataset)
     .enter()
     .append("text")
     .text(function(d) {return d;})
     .attr("y",function(d,i) { return svgHeight-d-2; })
     .attr("x",function(d,i) { return barWidth * i; })
     .attr("fill", "red"); */	

//-------------------------------------------------------------------------//
// <!-- FIRST WORK WITH D3 --!> //
// <!-- DRAWS A BLACK BOX, WHITE CIRCLE AND PRINTS "Hello there!" --!> //
        

     /*d3.select("h1")
    .style('color', "red");

    const canvas=d3.select(".canvas");
    //Add an svg element
    const svg = canvas.append("svg")
                .attr("width","500")
                .attr("height","250")
                
    svg.append("rect")
                .attr("width","100%")
                .attr("height","100%")
                .attr("fill","black")
                .attr("rx","15")
                .attr("ry","15");
          
    svg.append("circle")
                .attr("cx","50")
                .attr("cy","50")
                .attr("r","40")
                .attr("stroke","yellow")
                .attr("stroke-width","5")
                .attr("fill","white");   

    svg.append("text")
                .text("Hello there!")
                .attr("x","100")
                .attr("y","150")
                .attr("fill","white")
                .attr("font-size","24"); */
//-------------------------------------------------------------------------------------//
// <!-- BARCHART USING DATA IN JSON ARRAY FORMAT --!>
/*const canvas = d3.select(".canvas");

var dataArray=[3,13,27,45,12,26,62,0,50];
var dataArray=[
     {width: 25, height: 4, fill:"pink"},
     {width: 25, height: 14, fill:"orange"},
     {width: 25, height: 44, fill:"red"},
     {width: 25, height: 124, fill:"green"},
     {width: 25, height: 12, fill:"black"},
];
var svgHeight=1000;
const svg = canvas.append("svg")
            .attr("width",800)
            .attr("height",svgHeight);

const rect=svg.selectAll("rect");

var max = d3.max(dataArray,function(d) {return d.width;})
console.log(max);
console.log(dataArray);
               
rect.data(dataArray)
    .enter().append("rect")
    .attr("fill",function(d){return d.fill;})                                  //Colour  
    .attr("width",function(d){return d.width;})                                    //Width of the bar
    .attr("height",function(d) {return d.height*3;})                   //Height of the bar
    .attr("x",function(d,i) {return i*(d.width+max);})                 //Gaps between bars
    .attr("y",function(d) {return 500 - (d.height*3);});             //How far down the page - height
*/
//---------------------------------------------------------------------------------------------------------------------//
const canvas = d3.select(".canvas");
var svgHeight=1000;
var svgWidth=1000;
var leftMargin=150;
const svg1 = canvas.append("svg")
            .attr("width","100%")
            .attr("height","400");
const svg2 = canvas.append("svg")
                   .attr("width",svgWidth)
                   .attr("height",svgHeight);

const svg3 = canvas.append("svg")
                   .attr("width","100%")
                   .attr("height",20);
const repos=svg1.selectAll("text.title");
var rect=svg2.selectAll("rect");
const count=svg3.selectAll("text.count");

var circleLink="https://api.github.com/repos/mbostock/";


login="davek2000";
password="PASSWORD";

fetch("https://api.github.com/users/torvalds/repos", {
  headers: new Headers({
    "Authorization": `Basic ${(`${login}:${password}`)}`
  }),
}).then(response => {
  if (!response.ok) throw new Error(response.status);
})
  
d3.json("https://api.github.com/users/mbostock/repos?per_page=65", {
     headers: new Headers({
       "Authorization": `Basic ${(`${login}:${password}`)}`
     }),
   }).then(data => { 
     var stargazersCount =d3.map(data,function(d) {return d.stargazers_count;});
          //Prints name of repos
          repos.data(data)
               .enter().append("text")
               .text(function(d) {return d.name;})
               .attr("class","value")
               .attr("y",function(d,i) { return (30 * (Math.floor(i/5))+20); })
               .attr("x",function(d,i) { return 300*(i%5); })
               .attr("fill", "black");

          

          var stars = data.map(function(d) { return d.stargazers_count;});

          var names = data.map(function(d) {return d.name;});

          var scale = d3.scaleLinear()
                       .domain([d3.min(stars), d3.max(stars)])
                       .range([leftMargin, svgWidth - 100]);
           
         // Add scales to axis
          var x_axis = d3.axisBottom()
                        .scale(scale);

          svg2.append("g")
              .call(x_axis);
                         
          var nameScale = d3.scalePoint()
                            .domain(names)
                            .range([0,svgHeight+20]);

          var nameAxis = d3.axisLeft()
                           .scale(nameScale);

          svg2.append("g")
              .attr("transform", "translate(150, 2)")
              .attr("class","axis")
              .call(nameAxis);

           var y =d3.scaleLinear()
                    .domain([0,d3.max(data,function(d) {return d.stargazers_count;})])
                    .range([0,svgWidth]);
          //Draws bar chart
          rect.data(data)
               .enter().append("rect")                                  
               .attr("fill",function(d,i) {
                 if(d.stargazers_count>99)
                 {
                    return "green";
                 }
                 else return "red";
               })                                   
               .attr("width",function(d) {console.log(d.stargazers_count); return y(d.stargazers_count);})
               .attr("height",function(d,i) {return 6;})                     // Height of the bar
               .attr("x",function(d,i) {return leftMargin+1;})                                         // Gaps between bars
               .attr("y",function(d,i) {return i*16;})
               .append("title")
               .text((item) => `Stargazer count for ${item.name} is ${item.stargazers_count}`);
               

          svg2.append("g")
              .on("mouseover",function() {console.log("Hello");});
});
circleLink+="stack/contributors?per_page=100";
d3.json(circleLink, {
     headers: new Headers({
       "Authorization": `Basic ${(`${login}:${password}`)}`
     }),
   }).then(data2 => {
        var contributions = d3.map(data2,function(d) {return d.contributions;});
        var login = d3.map(data2,function(d) {return d.login;});
        
        // https://codepen.io/zakariachowdhury/pen/OWdyjq
        var text = "";
        
        var width = 200;
        var height = 200;
        var thickness = 40;
        var duration = 750;
        var padding = 10;
        var opacity = .8;
        var opacityHover = 1;
        var otherOpacityOnHover = .8;
        var tooltipMargin = 13;
        
        var radius = Math.min(width-padding, height-padding) / 2;
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        
        var svg = d3.select("#chart")
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);
        var g = svg.append('g')
        .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');
        
        var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
        
        var pie = d3.pie()
        .value(function(d) { return d.contributions; })
        .sort(null);
        
        var path = g.selectAll('path')
          .data(pie(data2))
          .enter()
          .append("g")  
          .append('path')
          .attr('d', arc)
          .attr('fill', (d,i) => color(i))
          .style('opacity', opacity)
          .style('stroke', 'white')
          .on("mouseover", function(d) {
              d3.selectAll('path')
                .style("opacity", otherOpacityOnHover);
              d3.select(this) 
                .style("opacity", opacityHover);
        
              let g = d3.select("svg")
                .style("cursor", "pointer")
                .append("g")
                .attr("class", "tooltip")
                .style("opacity", 0);
         
              g.append("text")
                .attr("class", "name-text")
                .text(`${d.login} (${d.contributions})`)
                .attr('text-anchor', 'middle');
            
              let text = g.select("text");
              let bbox = text.node().getBBox();
              let padding = 2;
              g.insert("rect", "text")
                .attr("x", bbox.x - padding)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + (padding*2))
                .attr("height", bbox.height + (padding*2))
                .style("fill", "white")
                .style("opacity", 0.75);
            })
          .on("mousemove", function(d) {
                let mousePosition = d3.pointer(event);
                let x = mousePosition[0] + width/2;
                let y = mousePosition[1] + height/2 - tooltipMargin;
            
                let text = d3.select('.tooltip text');
                let bbox = text.node().getBBox();
                if(x - bbox.width/2 < 0) {
                  x = bbox.width/2;
                }
                else if(width - x - bbox.width/2 < 0) {
                  x = width - bbox.width/2;
                }
            
                if(y - bbox.height/2 < 0) {
                  y = bbox.height + tooltipMargin * 2;
                }
                else if(height - y - bbox.height/2 < 0) {
                  y = height - bbox.height/2;
                }
            
                d3.select('.tooltip')
                  .style("opacity", 1)
                  .attr('transform',`translate(${x}, ${y})`);
            })
          .on("mouseout", function(d) {   
              d3.select("svg")
                .style("cursor", "none")  
                .select(".tooltip").remove();
            d3.selectAll('path')
                .style("opacity", opacity);
            })
          .on("touchstart", function(d) {
              d3.select("svg")
                .style("cursor", "none");    
          })
          .each(function(d, i) { this._current = i; });
        
        let legend = d3.select("#chart").append('div')
                       .attr('class', 'legend')
                       .style('margin-top', '30px');
        
        let keys = legend.selectAll('.key')
                       .data(data2)
                       .enter().append('div')
                       .attr('class', 'key')
                       .style('display', 'flex')
                       .style('align-items', 'center')
                       .style('margin-right', '20px');
        
                  keys.append('div')
                       .attr('class', 'symbol')
                       .style('height', '10px')
                       .style('width', '10px')
                       .style('margin', '5px 5px')
                       .style('background-color', (d, i) => color(i));
        
                  keys.append('div')
                       .attr('class', 'name')
                       .text(d => `${d.login} (${d.contributions})`);
        
                  keys.exit().remove();
   });