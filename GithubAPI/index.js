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
var svgHeight=1160;
const svg = canvas.append("svg")
            .attr("width","100%")
            .attr("height",800);
const svg2 = canvas.append("svg")
                   .attr("width","100%")
                   .attr("height",svgHeight);

const svg3 = canvas.append("svg")
                   .attr("width","100%")
                   .attr("height",15);
const repos=svg.selectAll("text.title");
const rect=svg2.selectAll("rect");
const count=svg3.selectAll("text.count");


login="davek2000";
password="PASSWORD";

fetch("https://api.github.com/users/mbostock/repos", {
  headers: new Headers({
    "Authorization": `Basic ${(`${login}:${password}`)}`
  }),
}).then(response => {
  if (!response.ok) throw new Error(response.status);
  else console.log(response);
})
  
d3.json("https://api.github.com/users/mbostock/repos?per_page=65", {
     headers: new Headers({
       "Authorization": `Basic ${(`${login}:${password}`)}`
     }),
   }).then(data => { 
     var stargazersCount =d3.map(data,function(d) {return d.stargazers_count;});
     var test=d3.map(data,function(d) {return d.html_url;});
          console.log(stargazersCount);
          console.log(test);
          for(i=0;i<stargazersCount.length;i++)
          {
               console.log("Stargazers for "+test[i]+" is "+stargazersCount[i]);
          }

          repos.data(data)
               .enter().append("text")
               .text(function(d) {return d.name;})
               .attr("class","value")
               .attr("y",function(d,i) { return (30 * (Math.floor(i/3))+20); })
               .attr("x",function(d,i) { return 300*(i%3); })
               .attr("fill", "black");

          var y =d3.scaleLinear()
                   .domain([0,d3.max(data,function(d) {return d.stargazers_count;})])
                   .range([0,600])

          rect.data(data)
               .enter().append("rect")                                  
               .attr("fill","red")                                   
               .attr("width",14)
               .attr("height",function(d) {return y(d.stargazers_count);})                   //Height of the bar
               .attr("x",function(d,i) {return i*35;})                                    //Gaps between bars
               .attr("y",function(d) {return (svgHeight - y(d.stargazers_count));})
               .append("title")
               .text((item) => { return item.name;})


          count.data(data)
               .enter().append("text")
               .text(function(d) {return d.stargazers_count;})
               .attr("class","title")
               .attr("y",function(d,i) { return 15; })
               .attr("x",function(d,i) { return i*35; })
               .attr("fill", "black");

});

