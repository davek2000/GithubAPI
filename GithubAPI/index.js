//javascript
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
     .attr("fill", "red");	*/

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

const canvas = d3.select(".canvas");

var dataArray=[3,13,27];

const svg = canvas.append("svg")
            .attr("width",800)
            .attr("height",800);

const rect=svg.selectAll("rect")
               
rect.data(dataArray)
    .enter().append("rect")
    .attr("fill","orange")
    .attr("width",24)
    .attr("height",function(d) {return d*3;})
    .attr("x",function(d,i) {return i*25;})
    .attr("y",function(d,i) {return 100 - (d*3)});






/*const rect2 = svg.append("rect");
const rect3 = svg.append("rect");

const allRectangles = svg.selectAll("rect");
allRectangles.attr("width",24)
    .attr("height",100)
    .attr("fill","orange")
    .data(dataArray)
    .attr("x",function(d, i) {return i * 30;})     //X-values = 0,100,200
    .attr("height",function(d) {console.log(d); return d*10;})     //d==3, 0th element of dataArray (i==0)
    .attr("y",function(d, i) {return 300-(d*10);}) */
    

    