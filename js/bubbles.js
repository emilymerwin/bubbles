$(document).ready(function() {
  $('#typeInfo').hide();
  $('#mostToLeast').hide();
  $('#bar').hide();
  
  bubbles();
  });

function bubbles() {
var w = 800,
    h = 600;

var svg = d3.select("#bubbles").append("svg:svg")
    .attr("width", w)
    .attr("height", h);


    
//var newDict = {};
var commasFormatter = d3.format(",.0f");
var radius_scale = d3.scale.pow().exponent(0.5).domain([0, 107848]).range([2, 110]);

d3.json("../data/hopeChildren.json", function(json) {
  var force = d3.layout.force()
    .gravity(0.05)
    .charge(function(d, i) { return d.students*-.013; })
    .nodes(json.children)
    .size([w, h])
    .links([])
    .start();
    
      

var node = svg.selectAll(".node")
        .data(json.children)
        .enter().append("svg:g")
        .attr("class", "node")
        .on('mouseover', function(d){
            var thisNode = d3.select(this);
            thisNode.select("text").style({opacity:'1.0'});
                    })
        .on('mouseout', function(d){
            var thisNode = d3.select(this);
            thisNode.select("text").style({opacity:'0.0'});
                    });

node.append("image")
      //.on("click", function(d) {
  //})
      .attr("xlink:href", (function(d) { return d.img; }))
      .attr("x", function(d) { return (radius_scale(parseInt(d.students))*-1); })
      .attr("y", function(d) { return (radius_scale(parseInt(d.students))*-1); })
      .attr("width", function(d) { return (radius_scale(parseInt(d.students))*2); })
      .attr("height", function(d) { return (radius_scale(parseInt(d.students))*2); });     
      
node.append("svg:circle")
        //.attr("cx", function(d) { return d.x; })
        //.attr("cy", function(d) { return d.y; })
        .attr("title", function(d) { return d.colleges; })
        .attr("r", function(d) { return radius_scale(parseInt(d.students)); })
        .attr("fill", function(d) { return d.fill; })
        .attr("stroke", function(d) { return d.stroke; })
        .attr("id", (function(d) { return d.id; }))
        .call(d3.helper.tooltip()
            .text(function(d){ return 'School: '+ d.college + '<br />Type of School: '+ d.type +'<br />HOPE Students: ' +commasFormatter(d.students) +'<br />Amount Awarded: $'+ commasFormatter(d.amount); })
        )
        .on('mouseover', function(d){
          d3.select(this).transition().duration(300).style({opacity:'0.8'});
                    })
        .on('mouseout', function(d){
          d3.select(this).transition().duration(200).style({opacity:'0.0',});
                    })
        .call(force.drag);        

node.append("text")
      .attr("dx", 0)
      //.attr("dy", function(d) { return (radius_scale(parseInt(d.students))*.7); })
      .attr("dy", function(d) { return (radius_scale(parseInt(d.students))*.2); })
      .attr("text-anchor", "middle")
      .style("font-size", function(d) { return (radius_scale(parseInt(d.students))*.4); })
      .text(function(d) { return commasFormatter(d.students); });

svg.style("opacity", 1e-6)
  .transition()
    .duration(1000)
    .style("opacity", 1);      
      
force.on("tick", function(e) {
      svg.selectAll("circle").attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      svg.selectAll("image").attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      svg.selectAll("text").attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });

d3.select("#sort").on("click", function(e){
  $('#typeInfo').show()
  $('#mostToLeast').hide()
  $('#bar').hide()
  force.on("tick", function(e) {
    svg.selectAll("circle").attr("r", function(d) { return radius_scale(parseInt(d.students));})
       .attr("transform", function(d) { return "translate(" + d.xValue + "," + d.yValue + ")";});
    svg.selectAll("image")
      .transition().duration(100)
      .attr("x", function(d) { return (radius_scale(parseInt(d.students))*-1); })
      .attr("y", function(d) { return (radius_scale(parseInt(d.students))*-1); })
      .attr("width", function(d) { return (radius_scale(parseInt(d.students))*2); })
      .attr("height", function(d) { return (radius_scale(parseInt(d.students))*2); })
      .attr("transform", function(d) { return "translate(" + d.xValue + "," + d.yValue + ")";});
    svg.selectAll("text")
      //.transition().duration(100)
      .style("font-size", function(d) { return (radius_scale(parseInt(d.students))*.4);})
      .attr("dy", function(d) { return (radius_scale(parseInt(d.students))*.2); })
      .attr("transform", function(d) { return "translate(" + d.xValue + "," + d.yValue + ")";});
  force.resume();
  });
});
d3.select("#sortSize").on("click", function(e){
  $('#typeInfo').hide()
  $('#mostToLeast').show()
  $('#bar').show()
  force.on("tick", function(e) {
    svg.selectAll("circle").attr("r", function(d) { return radius_scale(parseInt(d.students)*.25); })
      .attr("transform", function(d) { return "translate(" + d.xValueB + "," + d.yValueB + ")";})
      .on("click", function(d) {
            $('#'+d.id).css( "fill", "green" )
            });
    svg.selectAll("image")
      .transition().duration(100)
      .attr("x", function(d) { return (radius_scale(parseInt(d.students))*-.5); })
      .attr("y", function(d) { return (radius_scale(parseInt(d.students))*-.5); })
      .attr("width", function(d) { return (radius_scale(parseInt(d.students))); })
      .attr("height", function(d) { return (radius_scale(parseInt(d.students))); })
      .attr("transform", function(d) { return "translate(" + d.xValueB + "," + d.yValueB + ")";});
    svg.selectAll("text")
      //.transition().duration(100)
      .style("font-size", function(d) { return (radius_scale(parseInt(d.students))*.2);})
      .attr("dy", function(d) { return (radius_scale(parseInt(d.students))*.1); })
      .attr("transform", function(d) { return "translate(" + d.xValueB + "," + d.yValueB + ")";});
  force.resume();
  });
});
  
d3.select("#unSort").on("click", function(e){
  $('#typeInfo').hide()
  $('#mostToLeast').hide()
  $('#bar').hide()
  force.on("tick", function(e) {
    svg.selectAll("circle")
       .on('mouseover', function(d){
          d3.select(this).transition().duration(300).style({opacity:'0.8'});
                    })
       .on('mouseout', function(d){
          d3.select(this).transition().duration(200).style({opacity:'0.0',});
                    })
       .attr("r", function(d) { return radius_scale(parseInt(d.students));})
       .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});
    svg.selectAll("image")
      .transition().duration(100)
      .attr("x", function(d) { return (radius_scale(parseInt(d.students))*-1); })
      .attr("y", function(d) { return (radius_scale(parseInt(d.students))*-1); })
      .attr("width", function(d) { return (radius_scale(parseInt(d.students))*2); })
      .attr("height", function(d) { return (radius_scale(parseInt(d.students))*2); })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});
   svg.selectAll("text")
      .transition().duration(100)
      .style("font-size", function(d) { return (radius_scale(parseInt(d.students))*.4);})
      .attr("dy", function(d) { return (radius_scale(parseInt(d.students))*.2); })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";});
  force.resume();
  });
 });
});
};
