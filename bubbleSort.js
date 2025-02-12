var count = 9 + 1,
    durationTime = 300,
    array,
    unsortedArray,
    sortedArray = [],
    stop = false,
    steps = 0;

var margin = { top: 40, right: 40, bottom: 180, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var barWidth = width / count;
var x = d3.scaleLinear()
    .domain([0, count])
    .range([0, width]);
var svg = d3.select('.sh').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
var rects;
var labels;
function submit() {

    document.getElementById("submit").disabled = true;

    var array2 = document.getElementById("array");
    array2 = array2.value.split(" ").map(function (item) {
        return parseInt(item, 10);
    });
    console.log(array2);
    array = array2;
    unsortedArray = [...array];

    rects = svg.append("g")
        .attr("transform", "translate(" + barWidth + ",2)")
        .selectAll("rect")
        .data(unsortedArray)
        .enter().append("rect")

    rects.attr("id", function (d) { return "rect" + d })
        .attr("transform", function (d, i) { return "translate(" + (x(i) - barWidth) + ",0)" })
        .attr("width", barWidth * .9)
        .attr("height", function (d) { return d * barWidth / 3 })
    rects.attr("y", function (d) { return 400 - d * barWidth / 3; });

    labels = svg.selectAll("text")
        .data(unsortedArray)
        .enter().append("text")

    labels.attr("id", function (d) { return "text" + d })
        .attr("transform", function (d, i) { return "translate(" + x(i) + ",0)" })
        .attr("class", "unsorted")
        .html(function (d) { return d; })
}

function reset() {
    unsortedArray = [...array];
    sortedArray = [];
    stop = false;

    d3.select("#counter").html(steps = 0)

    labels.attr("class", "")
        .transition().duration(2000)
        .attr("transform", function (d, i) { return "translate(" + (x(i)) + ", 0)" })
        .attr("class", "unsorted")

    rects.attr("class", "")
        .transition().duration(2000)
        .attr("transform", function (d, i) { return "translate(" + (x(i - 1)) + ", 0)" })


    rects.attr("id", function (d) { return "rect" + d })
        .attr("transform", function (d, i) { return "translate(" + (x(i) - barWidth) + ",0)" })
        .attr("width", barWidth * .9)
        .attr("height", function (d) { return d * barWidth / 3 })
    rects.attr("y", function (d) { return 400 - d * barWidth / 3; });
}
function bubbleSort() {
    var sortedCount = 0;

    function sortPass(i) {
        if (i < unsortedArray.length) {
            if (unsortedArray[i] < unsortedArray[i - 1]) {
                
                // Highlight current bars being compared
                d3.select("#rect" + unsortedArray[i]).attr("class", "testing");
                d3.select("#rect" + unsortedArray[i - 1]).attr("class", "testing");

                d3.timeout(function () {
                    d3.select("#rect" + unsortedArray[i]).attr("class", "");
                    d3.select("#rect" + unsortedArray[i - 1]).attr("class", "");
                }, durationTime);

                // Swap the two elements in the array
                var temp = unsortedArray[i - 1];
                unsortedArray[i - 1] = unsortedArray[i];
                unsortedArray[i] = temp;

                // Slide the swapped elements to their new positions
                slide(unsortedArray[i], i);
                slide(unsortedArray[i - 1], i - 1);

                // Increment step counter
                d3.select("#counter").html(++steps);

                // Proceed to the next comparison
                d3.timeout(function () { return sortPass(++i); }, durationTime);
            } else {
                sortPass(++i);
            }
        } else {
            // Reset and call bubbleSort to repeat the process
            bubbleSort();
        }
    }
    sortPass(1);
}


function slide(d, i) {
    d3.select("#text" + d)
        .transition().duration(durationTime)
        .attr("transform", function (d) { return "translate(" + (x(i)) + ", 0)" })

    d3.select("#rect" + d)
        .transition().duration(durationTime)
        .attr("transform", function (d) { return "translate(" + (x(i - 1)) + ", 0)" })
}
