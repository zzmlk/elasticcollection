//check if js is linked
console.log('Hello Airtable');

//load airtable data and call it Airtable (find a hotel)
var Airtable = require('airtable');
console.log('airtable');

//use airtable lib, connecting data using API key and airtable base key(register guest info)
var base = new Airtable({ apiKey: 'keygDQVvm6DG6i9yJ' }).base('appQ3WXISaNO6PIfI');

//get the collection base (guest check in)
//select all the records (rows)
//specify function that will recieve the data
base("archive").select({}).eachPage(gotPageOfArchives, gotAllArchives);

//create an empty array to hold the data (get a room)
var archives = [];

//callback function to recive the data 
function gotPageOfArchives(records, fetchNextPage) {
    console.log('gotPageOfArchives()');
    //add the records from this page to our arry
    archives.push(...records);
    //request more pages 
    fetchNextPage();

}

//callback function when all the pages are loaded
function gotAllArchives(err) {
    console.log('gotAllArchives()');

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
    console.log("consolelogArchives()");
    archives.forEach((archive) => {
        console.log("Archive:", archive);
    });
}

var nameArray = [];
var linkArray = [];


function gotPageOfArchives(records, fetchNextPage) {
    records.forEach(function(archive) {
        const nodesObject = {
                name: archive.fields.photographer.replace(/\s*/g, ""),
            }
            // nameArray.push(nodesObject);
        graph.nodes.push(nodesObject);


        const nodesObject2 = {

                source: archive.fields.photographer.replace(/\s*/g, ""),
                target: archive.fields.photographer2.replace(/\s*/g, "")


            }
            // linkArray.push(nodesObject2);
        graph.links.push(nodesObject2);


        // const nodesObject3 = {

        //     target: archive.fields.photographer2
        // }
        // targetArray.push(nodesObject3);


    });
    fetchNextPage();
}
console.log(nameArray);
console.log(linkArray);









//look through airtable, create elements and add the data to the page
function showArchives() {
    console.log('showArchives()');
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
    console.log(nameArray, linkArray);

}

//initilize svg or grab svg
var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");

//intialize data
var graph = {

    nodes: [],


    // nodes: [
    //     { name: "Alice" },
    //     { name: "Bob" },
    //     { name: "Chen" },
    //     { name: "Dawg" },
    //     { name: "Ethan" },
    //     { name: "Frank" },
    //     { name: "George" },
    //     { name: "Hanes" },
    //     { name: "Iris" },


    // ]

    links: []

    // { source: "Alice", target: "Bob" },
    // { source: "Bob", target: "Chen" },
    // { source: "Chen", target: "Dawg" },
    // { source: "Dawg", target: "Ethan" },
    // { source: "Ethan", target: "Frank" },
    // { source: "Frank", target: "George" },
    // { source: "George", target: "Hanes" },
    // { source: "Hanes", target: "Alice" },
    // { source: "Alice", target: "Frank" },
    // { source: "Frank", target: "Bob" },
    // { source: "George", target: "Chen" },
    // { source: "Hanes", target: "Dawg" },
    // { source: "Dawg", target: "Iris" },
    // { source: "Iris", target: "Ethan" }



};
console.log(graph);

function rendersvg() {
    console.log('rendersvg()');
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

    .force("charge", d3.forceManyBody().strength(-10))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    var link = svg
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function(d) {
            return 3;
        });



    var node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("circles")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .attr("fill", function(d) {
            return "red";
        })
        .call(
            d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )



    // var lables = node.append("text")
    //     .text(function(d) {
    //         return d.name;
    //     })
    //     .style('fill', "#fff")
    //     .style('font-size', 10)
    //     .attr('dx', 6)
    //     .attr('dy', 3);

    // node.append("title")
    //     .text(function(d) { return d.name; });



    // var lable = svg
    //     .append('g')
    //     .attr('class', 'lables')
    //     .selectAll('texts')
    //     .data(graph.nodes)
    //     .enter()
    //     .append('text')
    //     .attr('text', function(d) {
    //         return d.name;
    //     })
    //     .attr('color', function(d) {
    //         return 'white';
    //     })
    //     .attr('x', 6)
    //     .attr('y', 3)


    // node.append("title")
    //     .text(function(d) { return d.name; });

    var text = svg
        .append('svg:g')
        .selectAll('g')
        .data(graph.nodes)
        .enter()
        .append('svg:g')
        .style('fill', "#fff")
        .style('font-size', 10);

    text.append('svg:text')
        .attr('x', 12)
        .attr('y', '.31em')
        .text(function(d) { return d.name });




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


        // node
        //     .attr('transform', function(d) {
        //         return 'translate(' + d.x + ',' + d.y + '(';
        //     })
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

        // .attr("cx", function(d) {
        //     return d.x;
        // })
        // .attr("cy", function(d) {
        //     return d.y;
        // });

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