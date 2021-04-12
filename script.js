//check if js is linked
//load airtable data and call it Airtable (find a hotel)
var Airtable = require('airtable');

//use airtable lib, connecting data using API key and airtable base key(register guest info)
var base = new Airtable({ apiKey: 'keygDQVvm6DG6i9yJ' }).base('appQ3WXISaNO6PIfI');

//get the collection base (guest check in)
//select all the records (rows)
//specify function that will recieve the data
base("archive").select({}).eachPage(gotPageOfArchives, gotAllArchives);

//create an empty array to hold the data (get a room)
var archives = [];

//callback function to recive the data 


//callback function when all the pages are loaded
function gotAllArchives(err) {
//     console.log('gotAllArchives()');

    //when there is an error, report this
    if (err) {
        console.log("error loading data");
        console.error(err);
        return;
    }

    //call functions to log and show the books
    consolelogArchives();
    showArchives();

}



//loop through the data and console log them 
function consolelogArchives() {
//     console.log("consolelogArchives()");
    archives.forEach((archive) => {
        console.log("Archive:", archive);
    });
}


var graph = {
    nodes: [],
    links: []
};
var colorArray = [];
function gotPageOfArchives(records, fetchNextPage) {
	var nameArray = [];
	var linkArray = [];
    records.forEach(function(archive) {
	    colorArray.push({region: archive.fields.region, color: archive.fields.color});
        const nodesObject = {
            name: archive.fields.photographer.replace(/\s*/g, ""),
            photo: archive.fields.photo,
            location: archive.fields.location,
            region: archive.fields.region,
            dotcolor: archive.fields.color,
        }
        graph.nodes.push(nodesObject);
        const nodesObject2 = {
            source: archive.fields.photographer.replace(/\s*/g, ""),
            target: archive.fields.photographer2.replace(/\s*/g, "")
        }
        graph.links.push(nodesObject2);
        localStorage.setItem("graph",JSON.stringify(graph));
    });
    fetchNextPage();
}
console.log(colorArray);
/*
console.log(nameArray);
console.log(linkArray);
*/


//look through airtable, create elements and add the data to the page
function showArchives() {
//     console.log('showArchives()');
    archives.forEach((archive) => {
        var photographer = document.createElement('h1');
        photographer.innerText = archive.fields.photographer;
        document.body.append(photographer);

        // var location = document.createElement('p');
        // location.innerText = archive.fields.location;
        // document.body.append(location);

        // var photo = document.createElement("img");
        // photo.src = archive.fields.photo[0].url; //array starts at 0
        // document.querySelector('.container').append(photo);
    });

    //render after dataset work
    rendersvg();
//     console.log(nameArray, linkArray);

}

//----------------------------------------d3---------------------------------//

//initilize svg or grab svg
var svg = d3.select("svg");
var alerttip = d3.select("section")
var width = svg.node().getBoundingClientRect().width;
var height = svg.node().getBoundingClientRect().height;

//intialize data
// console.log("123123123",graph);
var atotal = 0;
function qc(arr){
/*
    var resultObj = {};
    var result = [];
    var result2 = [];
    for(var i=0; i<arr.length; i++){
      if(result.indexOf(arr[i]) == -1){
        result.push(arr[i]);
      }else{
      if(result2.indexOf(arr[i]) == -1){
        result2.push(arr[i]);
      }
      }
    }
*/
    
    var obj = []
    arr.forEach((v,k)=>{
	    var color = v.color+"|||"+v.region;
      if(obj[color]){
        obj[color]++;
      }else{
        obj[color] = 1;
      }
      atotal++;
    });
    return obj;
}
function rendersvg() {
//     console.log('rendersvg()');
    var graph=localStorage.getItem("graph");
    graph = JSON.parse(graph);
    var carray = qc(colorArray);
    console.log(carray);
    carray.forEach((value, key) => {
		console.log(key);
	});
    
    for(let k in carray){
	    console.log(k);
        var tongji = d3.select(".tongji")
		    .append("div")
		    .attr("class", "tiao");
		var bfb = Math.round(carray[k] / atotal * 10000) / 100.00;
		var color = k.split("|||");
		var tongjitext = tongji.html(
			"<label>"+color[1]+"</label>"
			+"<span class=\"baifenbi\">"
			+"<span style=\"width: "+bfb+"%;background-color: "+color[0]+"\"></span>"
			+"</span>"
		);
    }
/*
    carray.forEach(function(value, index, array) {
	    console.log(value);
        var tongji = d3.select(".tongji")
		    .append("div")
		    .attr("class", "tiao");
		var bfb = Math.round(value / atotal * 10000) / 100.00;
		var tongjitext = tongji.html(
			"<label>"+index+"</label>"
			+"<span class=\"baifenbi\">"
			+"<span style=\"width: "+bfb+"%;background-color: "+array+"\"></span>"
			+"</span>"
		);
    });
    
    var tongji = d3.select(".tongji")
	    .append("div")
	    .attr("class", "tiao");
	var tongjitext = tongji.html(
		"<label>North_America</label>"
		+"<span class=\"baifenbi\">"
		+"<span style=\"width: 80%;background-color: "+d.dotcolor+"\"></span>"
		+"</span>"
	);
*/
	
    
    
    var simulation = d3
        .forceSimulation(graph.nodes)
        .force(
            "link",
            d3
            .forceLink()
            .id(function(d) {
                return d.name;
            })
            .links(graph.links)
        )
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);
	
    var g = svg.append("g")
        .attr("class", "everything");

    var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(svg);

    var link = g
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function(d) {
            return 3;
        });

    var node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("circles")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .attr("class","cc")
        .attr("param", function(d) {
            return d.name;
        })
        .style('cursor', "pointer")
        .attr("fill", function(d) {
            return d.dotcolor;
        })
        .call(
            d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )


    var text = g
        .append('svg:g')
        .selectAll('g')
        .data(graph.nodes)
        .enter()
        .append('svg:g')
        .attr("class","cc")
        .attr("param", function(d) {
            return d.name;
        })
        .style('cursor', "pointer")
        .style('fill', "#fff")
        .style('font-size', 5);

    text.append('svg:text')
        .attr('x', 12)
        .attr('y', '.31em')
        .text(function(d) { return d.name });

    function zoom_actions() {
        g.attr("transform", d3.event.transform)
        alerttip.style("transform", d3.event.transform)
    }

	text.on("click", function(d){
		alerttip.html("<div class=\"dcontent\"><a href=\"javascript:;\" id=\"close\"><span class=\"close\"></span></a>"
		+"<div class=\"dcontent1\">"
		+"<div class=\"dphoto\"><img src=\""+d.photo[0].thumbnails.large.url+"\"></div>"
		+"<div class=\"dcity\">"+d.region+"&nbsp;&nbsp;&nbsp;&nbsp;"+d.location+"</div>"
		+"<div class=\"dname\"><span>"+d.name+"</span></div>"
		+"</div>"
		+"</div>")
		.style("display","block")
		.style("width",width / 2)
		.style("height",height / 2)
		.style("margin-left","-"+ width / 4)
		.style("margin-top","-"+ height / 4)
		.style("background-color",d.dotcolor)
		var closebtn = d3.selectAll("a")
		
		closebtn.on("click", function(){
			console.log("123");
			alerttip.html("")
			.style("display","none")
		});
	});
	
	node.on("click", function(d){
		var cw = width/2;
		var ch = height/2;
		alerttip.html("<div class=\"dcontent\"><a href=\"javascript:;\" id=\"close\"><span class=\"close\"></span></a>"
		+"<div class=\"dcontent1\">"
		+"<div class=\"dphoto\"><img src=\""+d.photo[0].thumbnails.large.url+"\"></div>"
		+"<div class=\"dcity\">"+d.region+"&nbsp;&nbsp;&nbsp;&nbsp;"+d.location+"</div>"
		+"<div class=\"dname\"><span>"+d.name+"</span></div>"
		+"</div>"
		+"</div>")
		.style("display","block")
		.attr("width",cw)
		.attr("height",ch)
		.style("margin-left","-"+ width / 4)
		.style("margin-top","-"+ height / 4)
		.style("background-color",d.dotcolor)
		var closebtn = d3.selectAll("a")
		
		closebtn.on("click", function(){
			console.log("123");
			alerttip.html("")
			.style("display","none")
		});
	});
    
    function ticked() {
        link
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });



        node
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });


        text
            .attr('transform', function(d) {
                return 'translate(' + d.x + ',' + d.y + ')';
            });



    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }



    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
}

var bcolor = d3.selectAll(".block");
bcolor.on('click', function () {
	var color = d3.select(this).attr("param");
//   alert(color);
	d3.select("svg").html("");

	function gotPageOfArchives2(records, fetchNextPage) {
		var nameArray = [];
		var linkArray = [];
		var graph = {
		    nodes: [],
		    links: []
		};

	    records.forEach(function(archive) {
			if(archive.fields.color == color){
		        const nodesObject = {
		            name: archive.fields.photographer.replace(/\s*/g, ""),
		            photo: archive.fields.photo,
		            location: archive.fields.location,
		            region: archive.fields.region,
		            dotcolor: archive.fields.color,
		        }
		        graph.nodes.push(nodesObject);
		        const nodesObject2 = {
		            source: archive.fields.photographer.replace(/\s*/g, ""),
		            target: archive.fields.photographer2.replace(/\s*/g, "")
		        }
		        graph.links.push(nodesObject2);
            }
	    });
	    fetchNextPage();
	    localStorage.setItem("graph",JSON.stringify(graph));
		console.log(color,graph);
	    rendersvg();
	}
	base("archive").select({}).eachPage(gotPageOfArchives2);
})